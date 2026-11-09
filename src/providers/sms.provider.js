export const sendSMS = async ({ recipientId, message }) =>{
    console.log("----------MOCK SMS -----------");

    console.log("To:", recipientId);
    console.log("Message:", message);

    console.log("------------------------------");

    return {
        success: true,
        provider: "mock-sms"
    };
};

