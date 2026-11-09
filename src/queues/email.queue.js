import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const emailQueue = new Queue("email-queue",{
    connection: redisConnection
});

export default emailQueue;