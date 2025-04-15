import type { Activity, ActivityCategory, Member } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";

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

export const CategoryColumns: ColumnDef<ActivityCategory>[] = [
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

export const AttendanceColumns = [];
