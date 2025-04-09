import express from "express";
import { teamsService } from "./teams.service";

const teamsController = express.Router();

// Full list of teams, for the overview chart.
teamsController.get("/all", async (req, res) => {
  res.json(await teamsService.getAllTeams());
});

teamsController.post("/", async (req, res) => {
  res.json(await teamsService.createTeam(req.body));
});

export default teamsController;
