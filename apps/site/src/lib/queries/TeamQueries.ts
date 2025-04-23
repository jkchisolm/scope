import { queryOptions } from "@tanstack/react-query";
import type { Team } from "../types";

const getAllTeams = queryOptions({
  queryKey: ["allTeams"],
  queryFn: async () => {
    return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/teams/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    }).then((res) => res.json());
  },
});

const getSingleTeam = (teamId: string) => {
  return queryOptions({
    queryKey: ["team", teamId],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/teams/${teamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        }
      ).then((res) => res.json() as unknown as Team);
    },
  });
};

export const TeamQueries = {
  getAllTeams,
  getSingleTeam,
};
