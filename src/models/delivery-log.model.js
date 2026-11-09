import mongoose from "mongoose";

const deliveryLogSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true
    },

    channel: {
      type: String,
      enum: ["email", "sms", "push"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending"
    },

    provider: {
      type: String,
      default: null
    },

    error: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

deliveryLogSchema.index(
  { notificationId: 1, channel: 1 },
  { unique: true }
);

const DeliveryLog = mongoose.model("DeliveryLog", deliveryLogSchema);

export default DeliveryLog;