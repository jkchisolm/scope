import { NextFunction, Request, Response } from "express";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies["better-auth.session_token"]) {
    // If the user is authenticated, proceed to the next middleware
    next();
  } else {
    // If the user is not authenticated, return a 401 Unauthorized response
    res.status(401).json({ message: "Unauthorized" });
  }
};
