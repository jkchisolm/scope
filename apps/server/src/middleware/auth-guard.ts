import type { NextFunction, Request, Response } from "express";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  // console.log("cookies: ", req.cookies);
  if (req.cookies["better-auth.session_token"]) {
    // console.log("authenticated");
    // If the user is authenticated, proceed to the next middleware
    next();
  } else {
    // If the user is not authenticated, return a 401 Unauthorized response
    res.status(401).json({ message: "Unauthorized request." });
  }
};
