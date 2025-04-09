import express from "express";
import { activityService } from "./activities.service";

const activitiesController = express.Router();

activitiesController.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;
  res.json(await activityService.getActivitiesForTeam(teamId));
});

activitiesController.get("/member/:memberId", async (req, res) => {
  const { memberId } = req.params;
  res.json(await activityService.getActivitiesForMember(memberId));
});

activitiesController.post("/single", async (req, res) => {
  res.json(await activityService.createActivity(req.body));
});

activitiesController.post("/batch", async (req, res) => {
  res.json(await activityService.createBatchActivity(req.body));
});

export default activitiesController;
