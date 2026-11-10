import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import DLQ from "../models/dlq.model.js";

const dlqWorker = new Worker(
    "dead-letter-queue",
    async(job)=>{
        
        console.log("\n=======Dead Letter job========\n");
        console.log("DLQ Job ID:", job.id);
        console.log("Original Job ID:", job.data.originalJobId);
        console.log("Notification ID:", job.data.notificationId);
        console.log("Recipient ID:", job.data.recipientId);
        console.log("Failed Channel:", job.data.channel);
        console.log("Attempts Made:", job.data.attemptsMade);
        console.log("Failure Reason:", job.data.failedReason);

        console.log("=====================================\n");

        await DLQ.findOneAndUpdate(
        {
            originalJobId: job.data.originalJobId,
            channel: job.data.channel
        },
        {
            $setOnInsert: {
                originalJobId: job.data.originalJobId,
                notificationId: job.data.notificationId,
                recipientId: job.data.recipientId,
                channel: job.data.channel,
                failedReason: job.data.failedReason,
                attemptsMade: job.data.attemptsMade,
                originalData: job.data.originalData,
                status: "failed"
            }
        },
    {
        upsert: true,
        returnDocument: "after"
    }
);

console.log("DLQ record saved in MongoDB");

        return {
            processed: true,
            originalJobId: job.data.originalJobId
        };
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

dlqWorker.on("completed",(job)=>{
    console.log(`DLQ job ${job.id} processed successfully`);
});

dlqWorker.on("failed",(job)=>{
    console.log(`DLQ job ${job?.id} failed:`,error.message);
});

console.log("DLQ Worker Started");

export default dlqWorker;