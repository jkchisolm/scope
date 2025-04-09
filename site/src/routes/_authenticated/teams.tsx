import { AddTeamDialog } from "@/components/pages/teampage/AddTeamDialog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col justify-start items-start">
      <AddTeamDialog />
    </div>
  );
}
