import "dotenv/config"

import mongoose, { mongo } from "mongoose"
import {connectDB} from "../config/database.js"
import { recoverStuckDeliveries } from "../services/recovery.service.js"

const RECOVERY_INTERVAL = 30*1000;

let isRunning = false;

const startRecoveryProcess = async() => {
    try {

        await connectDB();
        console.log("Recovery Process Standard");
        
        const runRecovery = async() => {
            if(isRunning) return ;

            isRunning = true;

            try {
                await recoverStuckDeliveries();
            } catch (error) {
                console.error("Recovery failed:", error.message);
            } finally {
                isRunning = false;
            }
        };

        await runRecovery();
        setInterval(runRecovery, RECOVERY_INTERVAL);
        
    }
    catch(error){
        console.error("Recovery process Startup Failed:", error.message);
        process.exit(1);
    }
};

const shutdown = async() => {
    console.log("Shutting down recovery process....");
    await mongoose.connection.close();
    process.exit(0);
};

process.on("SIGINT",shutdown);
process.on("SIGTERM",shutdown);

startRecoveryProcess();