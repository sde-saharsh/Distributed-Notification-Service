import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import Notification from "../models/notification.model.js";
import DeliveryLog from "../models/delivery-log.model.js";
import { sendSMS } from "../providers/sms.provider.js";
import { updateNotificationStatus } from "../modules/notifications/notification-status.service.js";

const smsWorker = new Worker(
  "sms-queue",
  async (job) => {
    console.log("Processing SMS job:", job.id);

    const { notificationId, recipientId } = job.data;

    const idempotencyKey = `${notificationId}:sms`;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

     await DeliveryLog.updateOne(
        { notificationId, channel: "sms" },
        {
            $setOnInsert: {
                notificationId,
                channel: "sms",
                status: "pending"
            }
        },
        { upsert: true }
    );

    const claimedDelivery = await DeliveryLog.findOneAndUpdate(
        {
            notificationId,
            channel: "sms",
            status: { $in: ["pending", "failed"] }
        },
        {
            $set: {
                status: "processing",
                error: null
            }
        },
        { returnDocument: "after" }
    );

    if (!claimedDelivery) {
        console.log("SMS already processing or delivered. Skipping:", job.id);

        return {
            success: true,
            skipped: true,
            reason: "Already processing or delivered"
        };
    }

    await updateNotificationStatus(notificationId);

    try {
      
      const result = await sendSMS({
        recipientId,
        message: notification.message,
        idempotencyKey
      });

      if (!result.success) {
        throw new Error("SMS delivery failed");
      }

      await DeliveryLog.updateOne(
        { notificationId, channel: "sms" },
        {
          $set: {
            status: "sent",
            provider: result.provider,
            error: null
          }
        }
      );
      await updateNotificationStatus(notificationId);

      console.log("SMS processed successfully:", job.id);

      return result;

    } catch (error) {
      console.log("SMS attempt failed:", error.message);

      await DeliveryLog.updateOne(
          {
              notificationId,
              channel: "sms",
              status: "processing"
          },
          {
              $set: {
                  status: "pending",
                  error: error.message
              }
          }
      );

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);

smsWorker.on("completed", (job) => {
  console.log(`SMS job ${job.id} completed`);
});

smsWorker.on("failed", (job, error) => {
  console.error(`SMS job ${job?.id} failed:`, error.message);
});

console.log("SMS Worker started");

export default smsWorker;