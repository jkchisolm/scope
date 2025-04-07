import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "../lib/auth";
import userController from "#user/user.controller.js";
// var audit = require("express-requests-logger");
import audit from "express-requests-logger";
import bunyan from "bunyan";
const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    exposedHeaders: ["Set-Cookie"], // Specify exposed headers
  })
);

app.use(
  audit({
    logger: bunyan.createLogger({ name: "Scopey" }),
    shouldSkipAuditFunc: (req, res) => {
      return false;
    },
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
// app.all("/api/auth/sign-in/*splat", toNodeHandler(auth));
// app.all(/^\/api\/auth\/.*/, toNodeHandler(auth));

app.use(express.json());

app.get("/api/auth", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use("/api/user", userController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
