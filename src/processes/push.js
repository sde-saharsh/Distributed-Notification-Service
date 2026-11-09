import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../config/database.js";

let pushWorker;

const startPushWorker = async () => {
    try {
        await connectDB();
        const workerModule = await import("../workers/push.worker.js");

        pushWorker = workerModule.default;

    } catch (error) {
        console.error("Push Worker startup failed:", error.message);
        process.exit(1);
    }
};

const shutdown = async () => {
    console.log("Shutting down Push Worker...");

    if (pushWorker) {
        await pushWorker.close();
    }

    await mongoose.disconnect();

    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startPushWorker();