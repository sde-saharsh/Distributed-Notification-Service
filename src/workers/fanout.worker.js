import { Worker } from "bullmq";

import redisConnection from "../config/redis.js";
import { distributeNotification } from "../orchestrator/fanout.service.js";

// consume jobs from fanout queue
const fanoutWorker = new Worker(
    "fanout-queue",
    async (job) => {
        console.log("Processing fanout job:", job.id);
        await distributeNotification(job.data);
        console.log("Fanout job completed:", job.id);
    },
    {
        connection: redisConnection,
        concurrency: 5 // 5 task at time 
    }
);

fanoutWorker.on("completed",(job) => {
    console.log(`job ${job.id} completed succesfully`);
});

fanoutWorker.on("failed",(job) => {
    console.log(`job ${job.id} failed`, error.message);
});

console.log("Fanout Worker started");

export default fanoutWorker;