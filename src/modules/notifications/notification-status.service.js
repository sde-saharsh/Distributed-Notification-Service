import Notification from "../../models/notification.model.js";
import DeliveryLog from "../../models/delivery-log.model.js";

export const updateNotificationStatus = async (notificationId) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new Error("Notification not found");
    }

    const logs = await DeliveryLog.find({ notificationId });

    const selectedChannels = notification.channels;

    const channelLogs = selectedChannels.map(channel =>
        logs.find(log => log.channel === channel)
    );

    if (channelLogs.some(log => !log || log.status === "pending")) {
        await Notification.updateOne(
            { _id: notificationId },
            { $set: { status: "processing" } }
        );
        return;
    }

    const sentCount = channelLogs.filter(
        log => log.status === "sent"
    ).length;

    const failedCount = channelLogs.filter(
        log => log.status === "failed"
    ).length;

    let status;

    if (sentCount === selectedChannels.length) {
        status = "completed";
    } else if (failedCount === selectedChannels.length) {
        status = "failed";
    } else {
        status = "partially_completed";
    }

    await Notification.updateOne(
        { _id: notificationId },
        { $set: { status } }
    );

    console.log(`Notification ${notificationId} status: ${status}`);
};