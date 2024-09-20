import { Request, Response } from "express";
import { UserService } from "../../application/services/User.service";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const { id, name, email } = req.body;
    const user = await this.userService.createUser(id, name, email);
    res.status(201).json(user);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  }
}
