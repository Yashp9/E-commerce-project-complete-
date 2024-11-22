import Redis from "ioredis"
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_KEY);

//redis will store this as a key value pain key->foo and value->bar

// await redis.set('foo', 'bar');