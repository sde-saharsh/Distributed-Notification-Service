
import emailQueue from "../queues/email.queue.js";
import pushQueue from "../queues/push.queue.js";
import smsQueue from "../queues/sms.queue.js";

export const distributeNotification = async (data) => {

    const { notificationId, recipientId, channels } = data;

    const jobs = [];

    const jobData = {
        notificationId,
        recipientId
    };

    for (const channel of channels) {

        if (channel === "email") {
            jobs.push(
                emailQueue.add("send-email", jobData, {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 2000
                    }
                })
            );
        }
        else if (channel === "sms") {
            jobs.push(
                smsQueue.add("send-sms", jobData, {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 2000
                    }
                })
            );
        }
        else if (channel === "push") {
            jobs.push(
                pushQueue.add("send-push", jobData, {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 2000
                    }
                })
            );
        }
    }

    await Promise.all(jobs);

    console.log(
        `Notification ${notificationId} distributed to: ${channels.join(", ")}`
    );
};
