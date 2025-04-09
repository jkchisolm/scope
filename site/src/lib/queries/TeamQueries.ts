import { queryOptions } from "@tanstack/react-query";

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

export const TeamQueries = {
  getAllTeams,
};
