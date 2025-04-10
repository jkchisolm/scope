import { DataTable } from "@/components/table/DataTable";
import { ActivityDashboardColumns } from "@/components/table/DataTableColumns";
import { OverviewChart } from "@/components/pages/dashboard/OverviewChart";
import TeamCards from "@/components/pages/dashboard/TeamCards";
import type { ChartConfig } from "@/components/ui/chart";
import { ActivityQueries } from "@/lib/queries/ActivityQueries";
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
  const { data: activities } = useSuspenseQuery(ActivityQueries.getActivites);
  console.log(activities);
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
  const chartConfig = teams.reduce((config, team) => {
    config[team.name] = {
      label: team.name,
      color: team.color,
    };
    return config;
  }, {} as ChartConfig);

  console.log("chartConfig", chartConfig);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <TeamCards
            teams={teams.map((team) => ({
              name: team.name,
              color: team.color,
              points: team.points,
            }))}
          />
        </div>
        <div className="">
          <OverviewChart
            chartConfig={chartConfig}
            dailyPoints={combinedDaily}
          />
        </div>
        <div>
          <h2 className="font-bold text-2xl my-3">Most Recent Activities</h2>
          <DataTable columns={ActivityDashboardColumns} data={activities} />
        </div>
      </div>
    </div>
  );
}
