import express, { Request } from "express";
import { attendanceService } from "./attendance.service";

const attendanceController: express.Router = express.Router();

attendanceController.get("/:teamId&date=:date", async (req: Request, res) => {
  const { teamId, date } = req.params;

  // Assuming you have a function to get attendance data
  // Replace this with your actual logic to fetch attendance data
  res.json(await attendanceService.getAttendanceForTeam(teamId, date));
});

attendanceController.get("/:teamId", async (req: Request, res) => {
  const { teamId } = req.params;

  // Assuming you have a function to get attendance data
  // Replace this with your actual logic to fetch attendance data
  res.json(await attendanceService.getAllAttendanceForTeam(teamId));
});

attendanceController.post("/", async (req: Request, res) => {
  const { teamId, memberId, attendanceStatus, date } = req.body;

  // Assuming you have a function to set attendance data
  // Replace this with your actual logic to set attendance data
  res.json(
    await attendanceService.setAttendance(
      teamId,
      memberId,
      attendanceStatus,
      date
    )
  );
});

export default attendanceController;
