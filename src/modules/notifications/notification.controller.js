import { createNotificationService } from "./notification.service.js";
import { validateNotification } from "./notification.validation.js";

export const createNotification = async (req,res) => {

    try{

        const validationError = validateNotification(req.body);

        if(validationError){
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const notification = await createNotificationService(req.body);

        return res.status(200).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        })

    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}