import { OverviewChart } from "@/components/pages/dashboard/OverviewChart";
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

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]; // In the future, this will be team colors. For now, pre-programmed

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
      color: colors[index % colors.length],
    };
    return config;
  }, {} as ChartConfig);

  console.log("chartConfig", chartConfig);

  return (
    <div className="p-10">
      <OverviewChart chartConfig={chartConfig} dailyPoints={combinedDaily} />
    </div>
  );
}
