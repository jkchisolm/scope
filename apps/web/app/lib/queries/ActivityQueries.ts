import { queryOptions } from "@tanstack/react-query";
import type { Activity } from "@workspace/shared";

const getActivites = queryOptions({
  queryKey: ["getActivities"],
  queryFn: async () => {
    return await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/activities`
    ).then((res) => res.json() as unknown as Activity[]);
  },
});

export const ActivityQueries = {
  getActivites,
};
