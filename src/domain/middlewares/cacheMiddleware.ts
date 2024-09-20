import express from "express";
import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
  console.error("Redis error", err);
});

// Conectar ao Redis antes de usar
client.connect().then(() => {
  console.log("Conectado ao Redis");
});

// Middleware para verificar o cache
export const cacheMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const key = req.query.key as string;

  try {
    // Verificar se o cliente está conectado
    if (!client.isOpen) {
      await client.connect(); // Reconectar se o cliente estiver fechado
    }

    const data = await client.get(key);

    if (data !== null) {
      res.send(`Cache hit: ${data}`);
    } else {
      next();
    }
  } catch (err) {
    console.error("Redis error", err);
    next();
  }
};
