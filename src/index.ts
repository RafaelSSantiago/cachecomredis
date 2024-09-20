import express from "express";
import { createClient } from "redis";

const app = express();
const port = 3000;

// Configurar o cliente do Redis
const client = createClient();

client.on("error", (err) => {
  console.error("Redis error", err);
});

// Conectar ao Redis antes de usar
client.connect().then(() => {
  console.log("Conectado ao Redis");
});

// Middleware para verificar o cache
const cacheMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

// Rota que usa cache
app.get("/data", cacheMiddleware, async (req, res) => {
  const key = req.query.key as string;
  const value = req.query.value as string;

  // Simular uma operação de dados
  const data = `valor da key: ${key} é ${value}`;

  try {
    // Verificar se o cliente está conectado antes de usar
    if (!client.isOpen) {
      await client.connect();
    }

    // Armazenar no cache Redis
    await client.setEx(key, 3600, data); // expira em 1 hora

    res.send(`Falta de cache: ${data}`);
  } catch (err) {
    console.error("Erro ao salvar no Redis", err);
    res.status(500).send("Erro ao salvar no cache");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
