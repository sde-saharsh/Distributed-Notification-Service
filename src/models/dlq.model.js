import mongoose from "mongoose";

const dlqSchema = new mongoose.Schema(
    {
        originalJobId :{
            type: String,
            required: true
        },
        notificationId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
            required: true
        },
        recipientId :{
            type: String,
            required: true
        },
        channel:{
            type:String,
            enum:["emial","sms","push"],
            required: true
        },
        failedReason: {
            type: String,
            required: true
        },
        attemptsMade:{
            type: Number,
            required: true
        },
        originalData: {
            type: mongoose.Schema.Types.Mixed
        },
        status:{
            type: String,
            enum:["failed","replaying","replayed","resolved"],
            default: "failed"
        }
    
    },
    {
        timestamps: true
    }
);

dlqSchema.index({ originalJobId: 1, channel: 1 }, { unique: true });

const DLQ = mongoose.model("DLQ", dlqSchema);

export default DLQ;