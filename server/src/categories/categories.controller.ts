import express from "express";
import { categoriesService } from "./categories.service";

const categoriesController = express.Router();

categoriesController.get("/", async (req, res) => {
  res.json(await categoriesService.getCategories());
});

export default categoriesController;
