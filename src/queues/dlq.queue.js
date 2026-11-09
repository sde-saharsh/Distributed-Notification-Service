import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const dlqQueue = new Queue("dead-letter-queue",{
    connection: redisConnection
});

export default dlqQueue;