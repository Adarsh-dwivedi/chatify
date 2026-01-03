import { createClient } from "redis";
import { ENV } from "./env.js";

const redis = createClient({
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASSWORD,
    socket: {
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT
    }
});

redis.on("error", err => console.error("Redis client error", err));
await redis.connect();

export default redis;