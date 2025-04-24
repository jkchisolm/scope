import { queryOptions } from "@tanstack/react-query";
import { type Rule as Rule } from "@workspace/shared";

const getRules = queryOptions<Rule[], unknown>({
  queryKey: ["getCategories"],
  queryFn: async () => {
    return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/rules`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    }).then((res) => res.json() as unknown as Rule[]);
  },
});

export const CategoryQueries = {
  getCategories: getRules,
};
