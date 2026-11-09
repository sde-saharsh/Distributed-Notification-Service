
import "dotenv/config";
import mongoose from "mongoose";
import {connectDB} from "../config/database.js";
import { publishPendingEvents } from "../outbox/outbox.relay.js";
import fanoutQueue from "../queues/fanout.queue.js";

const POLLING_INTERVAL = 2000;

let isRunning = true;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const startRelay = async () => {
    try {
        await connectDB();

        console.log("Outbox Relay started");
        console.log("Polling interval: 2 seconds");

        while (isRunning) {
            try {
                await publishPendingEvents();
            } catch (error) {
                console.error("Relay polling error:", error.message);
            }

            if (isRunning) {
                await sleep(POLLING_INTERVAL);
            }
        }

    } catch (error) {
        console.error("Relay startup failed:", error.message);
        process.exitCode = 1;
    } finally {
        await fanoutQueue.close();
        await mongoose.disconnect();
        console.log("Outbox Relay stopped");
    }
};

const shutdown = () => {
    console.log("Shutting down Outbox Relay...");
    isRunning = false;
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startRelay();