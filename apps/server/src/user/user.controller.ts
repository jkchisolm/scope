import express, { Request, Response } from "express";
import { getCurrentUser } from "./user.service";

const userController = express.Router();

userController.get(
  "/me",
  async (req: Request, res: Response): Promise<void> => {
    // Assuming you have a function to get the current user
    res.json(await getCurrentUser(req));
  }
);

export default userController;
