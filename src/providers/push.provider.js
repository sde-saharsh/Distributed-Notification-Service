export const sendPush = async ({ recipientId, title, message }) => {

    console.log("-------- MOCK PUSH --------");

    console.log("To:", recipientId);
    console.log("Title:", title);
    console.log("Message:", message);

    console.log("---------------------------");

    return {
        success: true,
        provider: "mock-push"
    };
};