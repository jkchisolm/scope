import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "../lib/auth";
const app = express();
const port = process.env.PORT || 4000;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
