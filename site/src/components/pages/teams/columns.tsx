import type { Activity, Member } from "@/lib/types";
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
    accessorKey: "createdAt",
    header: "Date",
  },
];
