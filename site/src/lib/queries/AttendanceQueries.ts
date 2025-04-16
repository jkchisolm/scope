import { queryOptions } from "@tanstack/react-query";
import type { AttendanceResponse, AttendancesByDate } from "../types";

const getAttendanceForTeam = (teamId: string, date: Date, enabled: boolean) => {
  return queryOptions({
    queryKey: ["attendance", teamId, date],
    enabled,
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
      ).then((res) => res.json() as unknown as AttendanceResponse[]);
    },
  });
};

const getAllAttendanceForTeam = (teamId: string) => {
  return queryOptions({
    queryKey: ["attendance", teamId],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/attendance/${teamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        }
      ).then((res) => res.json() as unknown as AttendancesByDate);
    },
  });
};

export const AttendanceQueries = {
  getAttendanceForTeam,
  getAllAttendanceForTeam,
};
