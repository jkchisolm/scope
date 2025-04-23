import express from "express";
import { rulesService } from "./rules.service";

const rulesController = express.Router();

rulesController.get("/", async (req, res) => {
  res.json(await rulesService.getRules());
});

export default rulesController;
