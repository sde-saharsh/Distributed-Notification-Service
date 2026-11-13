export const sendEmail = async({recipientId, title, message,idempotencyKey}) =>{

    console.log("----------MOCK EMAIL---------");

    console.log("To:", recipientId);
    console.log("Subject:", title);
    console.log("Message:", message);
    console.log("idempotencyKey:", idempotencyKey);
    
    console.log("----------------------------");
    

    return {
        success: true,
        provider: "mock-email",
        idempotencyKey
    };
};

// export const sendEmail = async ({ recipientId, title, message }) => {
//     console.log("-------- MOCK EMAIL --------");
//     console.log("To:", recipientId);
//     console.log("Subject:", title);
//     console.log("Message:", message);
//     console.log("----------------------------");

//     throw new Error("Simulated email delivery failure");
// };