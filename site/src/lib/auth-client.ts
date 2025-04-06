import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  trustedOrigins: [
    "http://localhost:3001", // Local development front end origin
  ],
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  },
});
