export const sendSMS = async ({ recipientId, message ,idempotencyKey}) =>{
    console.log("----------MOCK SMS -----------");

    console.log("To:", recipientId);
    console.log("Message:", message);
    console.log("idempotencyKey:",idempotencyKey);

    console.log("------------------------------");

    return {
        success: true,
        provider: "mock-sms",
        idempotencyKey
    };
};

