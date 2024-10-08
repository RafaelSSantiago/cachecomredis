import express from "express";
import { UserRepositoryImpl } from "./infrastructure/repositories/user.repository.impl";
import { UserService } from "./application/services/User.service";
import { UserController } from "./interfaces/controllers/User.controller";
import { cacheMiddleware } from "./domain/middlewares/cacheMiddleware";

const app = express();
app.use(express.json());
app.use(cacheMiddleware);

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.post("/users", (req, res) => userController.createUser(req, res));
app.get("/users/:id", (req, res) => userController.getUserById(req, res));

export { app };
