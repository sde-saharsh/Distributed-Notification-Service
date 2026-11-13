export const sendPush = async ({ recipientId, title, message ,idempotencyKey}) => {

    console.log("-------- MOCK PUSH --------");

    console.log("To:", recipientId);
    console.log("Title:", title);
    console.log("Message:", message);
    console.log("idempotencyKey:",idempotencyKey);

    console.log("---------------------------");

    return {
        success: true,
        provider: "mock-push",
        idempotencyKey
    };
};