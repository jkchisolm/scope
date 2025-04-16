import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceQueries } from "@/lib/queries/AttendanceQueries";
import type { AttendanceResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [attendanceData, setAttendanceData] = useState<
    AttendanceResponse[] | null
  >(null);

  const availableDates = useMemo(() => {
    const startDate = new Date(creationDate);
    console.log(startDate);
    const today = new Date();
    const dates: Date[] = [];
    const d = new Date(startDate);

    // Loop until we reach the day before today
    while (d < today) {
      // console.log(d);
      const day = d.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, etc.
      // console.log(day);
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

  const { data: attendancesByDate } = useQuery(
    AttendanceQueries.getAllAttendanceForTeam(teamId)
  );

  if (!attendancesByDate) {
    return <div>Loading...</div>;
  }

  console.log(attendancesByDate);

  return (
    <div className="flex flex-col justify-start items-start">
      <h1 className="text-4xl font-bold">Attendance</h1>
      <div className="flex items-center gap-4 mt-10">
        <h3>Select Dates</h3>
        <Select
          onValueChange={(value) => {
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);
            setSelectedDate(selectedDate);
          }}
        >
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
      <div>
        {selectedDate && (
          <div>
            <h2 className="text-2xl font-bold mt-10">
              Attendance for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <ul className="mt-4">
              {attendancesByDate[selectedDate.toISOString()]?.map(
                (attendance) => (
                  <li key={attendance.id}>
                    {attendance.member?.name} -{" "}
                    {attendance.attended ? "Attended" : "Not Attended"}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
