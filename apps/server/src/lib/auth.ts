import { betterAuth } from "better-auth";
import { PrismaClient } from "../generated/prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://scope.jkchisolm.com", // Local development front end origin
  ],
});
