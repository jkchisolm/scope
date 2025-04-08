import express from "express";
import { teamsService } from "./teams.service";

const teamsController = express.Router();

teamsController.get("/all", async (req, res) => {
  res.json(await teamsService.getAllTeams());
});

export default teamsController;
