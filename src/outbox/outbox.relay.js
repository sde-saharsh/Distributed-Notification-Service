import { tryCatch } from "bullmq";
import Outbox from "../models/outbox.model.js";
import fanoutQueue from "../queues/fanout.queue.js";

export const publishPendingEvents = async() => {

    const pendingEvents = await Outbox.find({
        status: "pending"
    })
    .sort({createdAt: 1})
    .limit(10);

    for(const event of pendingEvents){
        try {
            await fanoutQueue.add(
                event.eventType,
                event.payload,
                {
                    jobId: event._id.toString()
                }
            );

            await Outbox.updateOne(
                {
                    _id: event._id,
                    status: "pending"
                },
                {
                    $set: {
                        status: "published",
                        publishedAt: new Date()
                    }
                }
            );

            console.log(`Event published: ${event._id} `);
        } catch (error) {
            console.error(
                `Failed to publish event ${event._id}:`,
                error.message
            );
        }
    }

}