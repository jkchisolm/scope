import { OverviewChart } from "@/components/pages/dashboard/OverviewChart";
import TeamCards from "@/components/pages/dashboard/TeamCards";
import type { ChartConfig } from "@/components/ui/chart";
import { TeamQueries } from "@/lib/queries/TeamQueries";
import type { Team } from "@/lib/types";
import { getDailyCombinedPoints } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
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

  const combinedDaily = getDailyCombinedPoints(teamDailyPoints, [
    // team names come from the teams array
    ...teams.map((team) => team.name),
  ]);

  console.log(combinedDaily);

  // create an object chartConfig
  // four keys with the team na,e and two properties: "label" (teamname) and "color" from the colors array
  const chartConfig = teams.reduce((config, team, index) => {
    config[team.name] = {
      label: team.name,
      color: team.color,
    };
    return config;
  }, {} as ChartConfig);

  console.log("chartConfig", chartConfig);

  return (
    <div className="p-10 grid grid-cols-2 grid-rows-2 gap-4">
      <OverviewChart chartConfig={chartConfig} dailyPoints={combinedDaily} />
      <div className="col-span-1 row-span-1 col-start-2 row-start-1 grid grid-cols-2 grid-rows-2 gap-4">
        <TeamCards
          teams={teams.map((team) => ({
            name: team.name,
            color: team.color,
            points: team.points,
          }))}
        />
      </div>
    </div>
  );
}
