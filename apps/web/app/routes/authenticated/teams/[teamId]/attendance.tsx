import { useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/attendance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DataTable } from "~/components/table/DataTable";
import { AttendanceColumns } from "~/components/table/DataTableColumns";
import { AttendanceQueries } from "~/lib/queries/AttendanceQueries";
import { useMemo, useState } from "react";

export default function Attendance({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { teamId } = params;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const creationDate = searchParams.get("creationDate");
  if (!creationDate || creationDate === null) {
    console.error("No creationDate");
    navigate("/dashboard");
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fetchAttendances, setFetchAttendances] = useState(false);

  const availableDates = useMemo(() => {
    const startDate = new Date(creationDate!);
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates: Date[] = [];
    const d = new Date(startDate);

    // Loop until we pass today (including today)
    while (d <= today) {
      const day = d.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, etc.
      if (day === 2 || day === 4) {
        dates.push(new Date(d));
      }
      d.setDate(d.getDate() + 1);
    }

    // Reverse to have the most recent date first.
    return dates.reverse();
  }, [creationDate]);

  const { data: attendances } = useQuery(
    AttendanceQueries.getAttendanceForTeam(
      teamId,
      selectedDate!,
      fetchAttendances
    )
  );

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
            setFetchAttendances(true);
            queryClient
              .refetchQueries(
                AttendanceQueries.getAttendanceForTeam(
                  teamId,
                  selectedDate,
                  fetchAttendances
                )
              )
              .then(() => {
                setFetchAttendances(false);
              });
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
      <div className="w-full">
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
              {attendances && !fetchAttendances ? (
                <DataTable
                  columns={AttendanceColumns}
                  data={attendances!}
                  pagination={false}
                />
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
