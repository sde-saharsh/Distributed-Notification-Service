import mongoose  from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    channels: {
        type: [String],
        required: true,
        enum: ["email", "sms", "push"]
    },

    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "failed",
            "partially_completed"
        ],
        default: "pending"
    }
},{
    timestamps:true
})

const Notification = mongoose.model("Notification",notificationSchema);
export default Notification;