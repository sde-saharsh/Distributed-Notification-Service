const ALLOWED_CHANNELS = ["email","sms","push"]

export const validateNotification = (data)=>{

    const { recipientId, title, message, channels } = data;

    if(!recipientId || typeof recipientId !== "string" || !recipientId.trim()){
        return "Valid recipientId is required";
    }

    if(!title || typeof title !== "string" || !title.trim()){
        return "Valid title is required";
    }

    if (!message || typeof message !== "string" || !message.trim()) {
        return "Valid message is required";
    }

    if(!Array.isArray(channels) || channels.length == 0){
        return "At least one channle is required";
    }

    if(channels.some(channels => !ALLOWED_CHANNELS.includes(channels))){
        return "Invalid channel. Allowed channels are email, sms, push";
    }

    if(new Set(channels).size !== channels.length){
        return "Duplicate channels are not allowed";
    }

    return null;

}