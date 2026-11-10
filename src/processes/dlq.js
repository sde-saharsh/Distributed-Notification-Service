import "dotenv/config";

import {connectDB} from "../config/database.js";
import mongoose from "mongoose";

let dlqWorker;

const startDLQWorker = async () => {
    try {
        await connectDB();

        const workerModule = await import("../workers/dlq.worker.js");
        dlqWorker = workerModule.default;

    } catch (error) {
        console.error("DLQ Worker startup failed:", error.message);
        process.exitCode = 1;
    }
};

const shutdown = async () => {
    console.log("Shutting down DLQ Worker...");

    if (dlqWorker) {
        await dlqWorker.close();
    }

    await mongoose.disconnect();

    console.log("DLQ Worker stopped");
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startDLQWorker();
