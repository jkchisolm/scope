import { queryOptions } from "@tanstack/react-query";

const getAttendanceForTeam = (teamId: string, date: Date) => {
  return queryOptions({
    queryKey: ["attendance", teamId, date],
    queryFn: async () => {
      return await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/attendance/${teamId}&date=${date.toISOString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        }
      ).then((res) => res.json());
    },
  });
};

export const AttendanceQueries = {
  getAttendanceForTeam,
};
