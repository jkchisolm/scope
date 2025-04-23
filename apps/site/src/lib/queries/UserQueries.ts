import { queryOptions } from "@tanstack/react-query";
import type { UserSession } from "../types/UserTypes";

const getCurrentUser = queryOptions({
  queryKey: ["currentUser"],
  queryFn: async (): Promise<UserSession> => {
    return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    }).then((res) => res.json());
  },
});

export const UserQueries = {
  getCurrentUser,
};
