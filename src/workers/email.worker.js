
import { Worker } from "bullmq";

import redisConnection from "../config/redis.js";
import Notification from "../models/notification.model.js";
import DeliveryLog from "../models/delivery-log.model.js";
import { updateNotificationStatus } from "../modules/notifications/notification-status.service.js";

import { sendEmail } from "../providers/email.provider.js";
import { moveToDLQ } from "../services/dlq.service.js";

const emailWorker = new Worker(
    "email-queue",

    async (job) => {
        console.log("Processing email job:", job.id);

        const { notificationId, recipientId } = job.data;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            throw new Error("Notification not found");
        }

        await DeliveryLog.findOneAndUpdate(
            {
                notificationId,
                channel: "email"
            },
            {
                $set: {
                    status: "pending",
                    error: null
                }
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        await updateNotificationStatus(notificationId);

        try {
            const result = await sendEmail({
                recipientId,
                title: notification.title,
                message: notification.message
            });

            if (!result.success) {
                throw new Error("Email delivery failed");
            }

            await DeliveryLog.updateOne(
                {
                    notificationId,
                    channel: "email"
                },
                {
                    $set: {
                        status: "sent",
                        provider: result.provider,
                        error: null
                    }
                }
            );

            await updateNotificationStatus(notificationId);

            console.log("Email processed successfully:", job.id);

            return result;

        } catch (error) {
            console.log("Email attempt failed:", error.message);
            throw error;
        }
    },

    {
        connection: redisConnection,
        concurrency: 5
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", async (job, error) => {
    if (!job) return;

    const maxAttempts = job.opts.attempts || 1;

    console.log("Email job failed:", job.id);
    console.log("Attempts made:", job.attemptsMade);
    console.log("Maximum attempts:", maxAttempts);
    console.log("Error:", error.message);

    if (job.attemptsMade < maxAttempts) {
        console.log("Retry pending...");
        return;
    }

    console.log("All retry attempts exhausted.");

    try {
        await moveToDLQ(job, error, "email");

        await DeliveryLog.updateOne(
            {
                notificationId: job.data.notificationId,
                channel: "email"
            },
            {
                $set: {
                    status: "failed",
                    error: error.message
                }
            }
        );

        await updateNotificationStatus(job.data.notificationId);

    } catch (dlqError) {
        console.error("Email DLQ processing failed:", dlqError.message);
    }
});

console.log("Email Worker started");

export default emailWorker;
