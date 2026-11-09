import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const smsQueue = new Queue("sms-queue",{
    connection: redisConnection
});

export default smsQueue;