import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

redisClient.connect();

export const setCache = async (key: string, value: string, ttl: number) => {
  await redisClient.setEx(key, ttl, value);
};

export const getCache = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};
