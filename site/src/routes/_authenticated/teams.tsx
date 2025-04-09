import { AddTeamDialog } from "@/components/pages/teampage/AddTeamDialog";
import { TeamQueries } from "@/lib/queries/TeamQueries";
import type { Team } from "@/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(TeamQueries.getAllTeams),
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 200,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(TeamQueries.getAllTeams);
  const teams = data as Team[];
  // get the dailyPoints array from each team and store in an array
  const teamDailyPoints = teams.map((team) => {
    return team.dailyPoints;
  });

  return (
    <div className="flex flex-col justify-start items-start">
      <AddTeamDialog />
    </div>
  );
}
