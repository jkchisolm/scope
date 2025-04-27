import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import type { Request } from "express";

const getCurrentUser = async (req: Request) => {
  // console.log(req.headers);

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  // console.log(session);

  return session;
};

export { getCurrentUser };
