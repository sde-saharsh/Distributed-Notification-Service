import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../config/database.js";

let smsWorker;
let isShuttingDown = false;

const startSmsWorker = async () => {
    try {
        await connectDB();

        const workerModule = await import("../workers/sms.worker.js");

        smsWorker = workerModule.default;

        console.log("SMS Worker process started successfully.");

    } catch (error) {
        console.error("SMS Worker startup failed:", error.message);

        await mongoose.disconnect();
        process.exitCode = 1;
    }
};

const shutdown = async (signal) => {
    if (isShuttingDown) return;

    isShuttingDown = true;

    console.log(`Received ${signal}. Shutting down SMS Worker...`);

    try {
        if (smsWorker) {
            await smsWorker.close();
            console.log("SMS Worker closed successfully.");
        }

        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully.");

        process.exitCode = 0;

    } catch (error) {
        console.error("Shutdown failed:", error.message);
        process.exitCode = 1;
    }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startSmsWorker();