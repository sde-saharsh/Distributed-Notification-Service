import mongoose from "mongoose";

const outboxSchema = new mongoose.Schema(
    {
        eventType: {
            type: String,
            required: true
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "published"],
            default: "pending"
        },
        publishedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Outbox = mongoose.model("Outbox", outboxSchema);

export default Outbox;