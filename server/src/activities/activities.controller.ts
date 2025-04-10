import express from "express";
import { activityService } from "./activities.service";

const activitiesController = express.Router();

/**
 * Get activites, sorted by date
 */
activitiesController.get("/", async (req, res) => {
  const activities = await activityService.getActivities();
  res.json(activities);
});

/**
 * Get activities for a specific team
 */
activitiesController.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;
  res.json(await activityService.getActivitiesForTeam(teamId));
});

/**
 * Get activities for a specific member (not implemented yet)
 */
activitiesController.get("/member/:memberId", async (req, res) => {
  const { memberId } = req.params;
  res.json(await activityService.getActivitiesForMember(memberId));
});

/**
 * Add a single activity
 */
activitiesController.post("/single", async (req, res) => {
  res.json(await activityService.createActivity(req.body));
});

/**
 * Add a batch of activities
 */
activitiesController.post("/batch", async (req, res) => {
  res.json(await activityService.createBatchActivity(req.body));
});

export default activitiesController;
