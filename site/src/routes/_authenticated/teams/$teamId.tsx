import { TeamQueries } from "@/lib/queries/TeamQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams/$teamId")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const { teamId } = params;
    if (!teamId) {
      throw new Error("Team ID is required");
    }

    queryClient.prefetchQuery(TeamQueries.getSingleTeam(teamId));
  },
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 200,
});

function RouteComponent() {
  const { teamId } = Route.useParams();
  if (!teamId) {
    return <div>No team ID provided</div>;
  }
  // Fetch the team data using the teamId
  const { data } = useSuspenseQuery(TeamQueries.getSingleTeam(teamId));

  console.log(data);

  return <div>Hello "/_authenticated/teams/$teamId"!</div>;
}
