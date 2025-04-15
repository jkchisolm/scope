import express, { Request } from "express";
import { attendanceService } from "./attendance.service";

const attendanceController = express.Router();

attendanceController.get("/:teamId&date=:date", async (req: Request, res) => {
  const { teamId, date } = req.params;

  // Assuming you have a function to get attendance data
  // Replace this with your actual logic to fetch attendance data
  res.json(await attendanceService.getAttendanceForTeam(teamId, date));
});

export default attendanceController;
