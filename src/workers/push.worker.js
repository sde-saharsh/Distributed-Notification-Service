import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import Notification from "../models/notification.model.js";
import DeliveryLog from "../models/delivery-log.model.js";
import { sendPush } from "../providers/push.provider.js";

import { updateNotificationStatus } from "../modules/notifications/notification-status.service.js";

const pushWorker = new Worker(
  "push-queue",
  async (job) => {
    console.log("Processing push job:", job.id);

    const { notificationId, recipientId } = job.data;

    const idempotencyKey = `${notificationId}:push`;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    await DeliveryLog.updateOne(
        { notificationId, channel: "push" },
        {
            $setOnInsert: {
                notificationId,
                channel: "push",
                status: "pending"
            }
        },
        { upsert: true }
    );

    const claimedDelivery = await DeliveryLog.findOneAndUpdate(
        {
            notificationId,
            channel: "push",
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
        console.log("Email already processing or delivered. Skipping:", job.id);

        return {
            success: true,
            skipped: true,
            reason: "Already processing or delivered"
        };
    }
    
    await updateNotificationStatus(notificationId);

    try {

      const result = await sendPush({
        recipientId,
        title: notification.title,
        message: notification.message,
        idempotencyKey
      });

      if (!result.success) {
        throw new Error("Push notification delivery failed");
      }

      await DeliveryLog.updateOne(
        { notificationId, channel: "push" },
        {
          $set: {
            status: "sent",
            provider: result.provider,
            error: null
          }
        }
      );
      await updateNotificationStatus(notificationId);

      console.log("Push notification processed successfully:", job.id);

      return result;

    } catch (error) {
      console.log("Push attempt failed:", error.message);

      await DeliveryLog.updateOne(
          {
              notificationId,
              channel: "push",
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

pushWorker.on("completed", (job) => {
  console.log(`Push job ${job.id} completed`);
});

pushWorker.on("failed", (job, error) => {
  console.error(`Push job ${job?.id} failed:`, error.message);
});

console.log("Push Worker started");

export default pushWorker;