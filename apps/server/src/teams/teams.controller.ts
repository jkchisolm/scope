import express from "express";
import { teamsService } from "./teams.service";

const teamsController: express.Router = express.Router();

// Full list of teams, for the overview chart.
teamsController.get("/all", async (_req, res) => {
  res.json(await teamsService.getAllTeams());
});

teamsController.get("/:teamId", async (req, res) => {
  const { teamId } = req.params;
  res.json(await teamsService.getTeam(teamId));
});

teamsController.post("/", async (req, res) => {
  res.json(await teamsService.createTeam(req.body));
});

export default teamsController;
