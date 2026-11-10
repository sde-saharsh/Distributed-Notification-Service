import DLQ from "../models/dlq.model.js";

import emailQueue from "../queues/email.queue.js";
import smsQueue from "../queues/sms.queue.js";
import pushQueue from "../queues/push.queue.js";

const channelQueues = {
    email: emailQueue,
    sms: smsQueue,
    push: pushQueue
};

export const replayDLQJob = async(dlqId) =>{

    const dlqRecord = await DLQ.findByIdAndUpdate(
        {
            _id: dlqId,
            status: "failed"
        },
        {
            $set:{
                status: "replaying"
            }
        },
        {
            returnDocument:"after"
        }
    );

    if(!dlqRecord){
        throw new Error(
            "DLQ record not found or already replayed/replaying"
        );
    }

    try {
        
        const queue = channelQueues[dlqRecord.channel];

        if(!queue){
            throw new Error("Invalid notification channel");
        }

        const jobData = dlqRecord.originalData || {
            notificationId: dlqRecord.notificationId,
            recipientId: dlqRecord.recipientId
        };

        await queue.add(
            `replay-${dlqRecord.channel}`,
            jobData,
            {
                jobId: `replay-${dlqRecord._id}-${Date.now()}`,
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000
                }
            }
        );

        await DLQ.updateOne(
            {
                _id: dlqRecord._id,
                status: "replaying"
            },
            {
                $set: {
                    status: "replayed"
                }
            }
        );

        console.log(
            `DLQ job replayed successfully: ${dlqRecord._id}`
        );

        return dlqRecord;

    } catch (error) {
        await DLQ.updateOne(
            {
                _id: dlqRecord._id,
                status: "replaying"
            },
            {
                $set: {
                    status: "failed"
                }
            }
        );

        throw error;
    }

}