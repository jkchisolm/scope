import { queryOptions } from "@tanstack/react-query";
import { type ActivityCategory } from "@/lib/types";

const getCategories = queryOptions<ActivityCategory[], unknown>({
  queryKey: ["getCategories"],
  queryFn: async () => {
    return await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/categories`
    ).then((res) => res.json());
  },
});

export const CategoryQueries = {
  getCategories,
};
