import type {
  Activity,
  Rule,
  AttendanceResponse,
  Member,
} from "@workspace/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";

export const MemberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Name",
  }, // In the future there will be more fields, but for now we just stick with name!
];

export const ActivityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        // hour: "2-digit",
        // minute: "2-digit",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      // const formattedTime = date.toLocaleTimeString("en-US", {
      //   hour: "2-digit",
      //   minute: "2-digit",
      // });
      return (
        <div className="flex flex-col">
          <span>{formattedDate}</span>
          {/* <span>{formattedTime}</span> */}
        </div>
      );
    },
  },
];

export const CategoryColumns: ColumnDef<Rule>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
];

export const ActivityDashboardColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "Team.name",
    header: "Team",
    cell: ({ row }) => {
      const color = row.original.Team.color;
      // console.log(color);
      return (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-sm"
            style={{ backgroundColor: color }}
          />
          {row.original.Team.name}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        // hour: "2-digit",
        // minute: "2-digit",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      // const formattedTime = date.toLocaleTimeString("en-US", {
      //   hour: "2-digit",
      //   minute: "2-digit",
      // });
      return (
        <div className="flex flex-col">
          <span>{formattedDate}</span>
          {/* <span>{formattedTime}</span> */}
        </div>
      );
    },
  },
];

export const AttendanceColumns: ColumnDef<AttendanceResponse>[] = [
  {
    accessorKey: "member.name",
    header: "Name",
  },
  {
    accessorKey: "attended",
    header: "Attended",
    cell: ({ row }) => {
      const member = row.original;
      // console.log(member);
      const attended = row.getValue("attended");
      return (
        <div className="flex items-center gap-2">
          {attended ? (
            <span className="text-green-500">Attended</span>
          ) : member.isExcused ? (
            <span className="text-yellow-500">Excused</span>
          ) : (
            <span className="text-red-500">Not Attended</span>
          )}
        </div>
      );
    },
  },
  {
    id: "options",
    cell: ({ row }) => {
      const member = row.original;
      const queryClient = useQueryClient();

      const { mutateAsync: setAttendance } = useMutation({
        mutationFn: async ({
          teamId,
          memberId,
          attendanceStatus,
          date,
        }: {
          teamId: string;
          memberId: string;
          attendanceStatus: string;
          date: string;
        }) => {
          return await fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/attendance/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                teamId,
                memberId,
                attendanceStatus,
                date,
              }),
              credentials: "include", // Include cookies in the request
            }
          );
        },
        onSuccess: () => {
          queryClient.refetchQueries();
        },
      });

      return (
        <RadioGroup
          className="flex flex-row"
          defaultValue={
            member.attended
              ? "attended"
              : member.isExcused
              ? "excused"
              : "notattended"
          }
          onValueChange={(value) => {
            const teamId = member.team.id;
            const memberId = member.memberId;
            // console.log(typeof member.date);

            toast.promise(
              setAttendance({
                teamId,
                memberId,
                attendanceStatus: value,
                date: member.date as unknown as string,
              }),
              {
                loading: "Updating attendance...",
                success: "Attendance updated!",
                error: (err) => {
                  console.error(err);
                  return "Error updating attendance";
                },
              }
            );
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="attended" id="r1" />
            <Label htmlFor="r1">Attended</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excused" id="r2" />
            <Label htmlFor="r2">Excused</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notattended" id="r3" />
            <Label htmlFor="r3">Did not attend</Label>
          </div>
        </RadioGroup>
      );
    },
  },
];
