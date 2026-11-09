import dlqQueue from "../queues/dlq.queue.js";

export const moveToDLQ = async (job, error,channel) => {

    if(!job){
        return ;
    }

    const maxAttempts = job.opts.attempts || 1;
    if(job.attemptsMade < maxAttempts){
        return ;
    }

    await dlqQueue.add(
        "failed-notification",
        {
            originalJobId: job.id,
            notificationId: job.data.notificationId,
            recipientId: job.data.recipientId,
            channel,
            failedReason: error.message,
            attemptsMade: job.attemptsMade,
            originalData: job.data
        },
        {
            jobId: `${job.id}-${channel}`
        }
    );

    console.log(
        `Job ${job.id} moved to DLQ for channel: ${channel}`
    );

}