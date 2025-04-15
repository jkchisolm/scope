import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { AttendanceQueries } from "@/lib/queries/AttendanceQueries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { z } from "zod";

const attendanceSearchSchema = z.object({
  creationDate: z.string(),
});

export const Route = createFileRoute(
  "/_authenticated/teams/$teamId/attendance"
)({
  component: RouteComponent,
  validateSearch: attendanceSearchSchema,
});

function RouteComponent() {
  const { creationDate } = Route.useSearch();
  const { teamId } = Route.useParams();

  const availableDates = useMemo(() => {
    const startDate = new Date(creationDate);
    const today = new Date();
    const dates: Date[] = [];
    const d = new Date(startDate);

    // Loop until we reach the day before today
    while (d < today) {
      const day = d.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, etc.
      if (day === 2 || day === 4) {
        dates.push(new Date(d));
      }
      d.setDate(d.getDate() + 1);
    }

    // Check if today is Tuesday or Thursday
    const todayDay = today.getDay();
    if (todayDay === 2 || todayDay === 4) {
      dates.push(new Date(today));
    }
    // Reverse the array to have the most recent date first

    return dates.reverse();
  }, [creationDate]);

  const date = new Date(creationDate);

  const { data } = useQuery(
    AttendanceQueries.getAttendanceForTeam(teamId, date)
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <div className="flex flex-col justify-start items-start">
      <h1 className="text-4xl font-bold">Manage Attendance</h1>
      <div className="flex items-center gap-4 mt-10">
        <h3>Select Dates</h3>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent className="max-h-96">
            {availableDates.map((date) => (
              <SelectItem key={date.toISOString()} value={date.toISOString()}>
                {date.toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
