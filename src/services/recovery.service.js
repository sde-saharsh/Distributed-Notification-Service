import DeliveryLog from "../models/delivery-log.model.js";
import Notification from "../models/notification.model.js";

import emailQueue from "../queues/email.queue.js"
import smsQueue from "../queues/sms.queue.js"
import pushQueue from "../queues/push.queue.js"

import { PROCESSING_TIMEOUT } from "../config/recovery.config.js";

const channelQueues = {
    email: emailQueue,
    push: pushQueue,
    sms: smsQueue
};

const jobNames = {
    email: "send-email",
    sms : "send-sms",
    push: "send-push"
};

export const recoverStuckDeliveries = async() =>{

    const cutofftime = new Date(Date.now() - PROCESSING_TIMEOUT);

    const stuckDeliveries = await DeliveryLog.find({
        channel: { $in : ["email","sms","push"]},
        status:"processing",
        processingAt: {$lt: cutofftime}
    });

    for(const delivery of stuckDeliveries){

        const notification = await Notification.findById(
            delivery.notificationId
        );

        if(!notification){
            console.log("Notification not found:", delivery.notificationId);
            continue;
        }
        
        const recoveredDelivery = await DeliveryLog.findOneAndUpdate(
            {
                _id: delivery._id,
                status: "processing",
                processingAt: {$lt: cutofftime}
            },
            {
                $set:{
                    status: "pending",
                    processingAt: null,
                    error: "Recovered after processing timeout"
                }
            },
            {
                returnDocument : "after"
            }
        );

        if(!recoveredDelivery) continue;
        
        const queue = channelQueues[delivery.channel];

        await queue.add(
            jobNames[delivery.channel],
            {
                notificationId: delivery.notificationId,
                recipientId: delivery.recipientId
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000
                }
            }
        );

        console.log(
            `Recovered stuck ${delivery.channel} delivery:`,
            delivery.notificationId
        );
    }

};