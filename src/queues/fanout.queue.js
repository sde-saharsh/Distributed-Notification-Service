import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const fanoutQueue = new Queue("fanout-queue",{
    connection: redisConnection
});

export default fanoutQueue;