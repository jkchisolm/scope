import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import userController from "./user/user.controller";
import teamsController from "./teams/teams.controller";
import rulesController from "./rules/rules.controller";
import activitiesController from "./activities/activities.controller";
import { authGuard } from "./middleware/auth-guard";
import cookieParser from "cookie-parser";
import attendanceController from "./attendance/attendance.controller";
import "dotenv/config";

const app = express();
const port = process.env.SERVER_PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://scope.jkchisolm.com",
    ], // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    exposedHeaders: ["Set-Cookie"], // Specify exposed headers
  })
);

// This is for logging requests and responses. However, for some completely unknown reason, auth does *not* work if you uncomment this. Don't do it.
// app.use(
//   audit({
//     logger: bunyan.createLogger({ name: "Scopey" }),
//     shouldSkipAuditFunc: (req, res) => {
//       return false;
//     },
//     excludeURLs: ["auth"],
//   })
// );

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authGuard, userController);
app.use("/api/teams", authGuard, teamsController);
app.use("/api/rules", authGuard, rulesController);
app.use("/api/activities", authGuard, activitiesController);
app.use("/api/attendance", authGuard, attendanceController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
