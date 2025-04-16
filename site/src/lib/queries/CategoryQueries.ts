import { queryOptions } from "@tanstack/react-query";
import { type ActivityCategory } from "@/lib/types";

const getCategories = queryOptions<ActivityCategory[], unknown>({
  queryKey: ["getCategories"],
  queryFn: async () => {
    return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    }).then((res) => res.json() as unknown as ActivityCategory[]);
  },
});

export const CategoryQueries = {
  getCategories,
};
