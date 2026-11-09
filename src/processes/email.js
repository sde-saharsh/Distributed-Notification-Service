import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../config/database.js";

let emailWorker;

const startEmailWorker = async () => {
    try {
        await connectDB();

        const workerModule = await import("../workers/email.worker.js");

        emailWorker = workerModule.default;

    } catch (error) {
        console.error("Email Worker startup failed:", error.message);
        process.exit(1);
    }
};

const shutdown = async () => {
    console.log("Shutting down Email Worker...");

    if (emailWorker) {
        await emailWorker.close();
    }

    await mongoose.disconnect();

    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startEmailWorker();