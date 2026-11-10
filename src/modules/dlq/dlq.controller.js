import mongoose from "mongoose";
import { replayDLQJob } from "../../services/dlq-replay.service.js";

export const replayDLController = async(req,res) => {
    try {
        
        const {dlqId} = req.params;

        if(!mongoose.isValidObjectId(dlqId)){
            return res.status(400).json({
                success: false,
                message: "Invalid DLQ record ID"
            });
        }

        const result = await replayDLQJob(dlqId);

        return res.status(200).json({
            success: true,
            message: "DLQ job replayed successfully",
            data: {
                dlqId: result._id,
                notificationId: result.notificationId,
                channel: result.channel,
                status: "replayed"
            }
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            message: error.message
        });
    }
};