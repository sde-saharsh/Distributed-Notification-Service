import IORedis from "ioredis"

const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_HOST || 6379,
    maxRetriesPerRequest: null
});

redisConnection.on("connect", ()=>{
    console.log("Redis connected successfully");
});

redisConnection.on("error", ()=>{
    console.error("Redis connection error:", error.message);
});

export default redisConnection;