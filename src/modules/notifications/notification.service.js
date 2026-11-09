import Notification from "../../models/notification.model.js";
import Outbox from "../../models/outbox.model.js";

import mongoose from "mongoose";

export const createNotificationService = async(data) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. create transaction
        const [notification] = await Notification.create(
            [{
                recipientId: data.recipientId,
                title: data.title,
                message: data.message,
                channels: data.channels
            }],
            {
                session
            }
        )

        // 2. create outbox event
        await Outbox.create(
            [{
                eventType: "notification.created",
                payload: {
                    notificationId: notification._id.toString(),
                    recipientId : data.recipientId,
                    channels: data.channels
                }
            }],
            { session }
        );

        // 3.commit both operation
        await session.commitTransaction();

        return notification;
    }
    catch(error){
        await session.abortTransaction();
        throw error;
    }
    finally{
        await session.endSession();
    }

}