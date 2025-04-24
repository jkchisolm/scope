import express from "express";
import { rulesService } from "./rules.service";

const rulesController: express.Router = express.Router();

rulesController.get("/", async (_req, res) => {
  res.json(await rulesService.getRules());
});

export default rulesController;
