import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const pushQueue = new Queue("push-queue",{
    connection: redisConnection
});

export default pushQueue;