import { TeamQueries } from "~/lib/queries/TeamQueries";
import { queryClient } from "~/root";
import type { Route } from "./+types/dashboard";
import type { Activity, Team } from "@workspace/shared";
import { OverviewChart } from "~/components/pages/dashboard/OverviewChart";
import TeamCards from "~/components/pages/dashboard/TeamCards";
import { DataTable } from "~/components/table/DataTable";
import { ActivityDashboardColumns } from "~/components/table/DataTableColumns";
import type { ChartConfig } from "~/components/ui/chart";
import { getDailyCombinedPoints } from "~/lib/utils";
import { ActivityQueries } from "~/lib/queries/ActivityQueries";

export async function clientLoader(): Promise<{
  teams: Team[];
  activities: Activity[];
}> {
  const teams = await queryClient.ensureQueryData(TeamQueries.getAllTeams);
  const activities = await queryClient.ensureQueryData(
    ActivityQueries.getActivites
  );
  return { teams, activities };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { teams, activities } = loaderData as unknown as {
    teams: Team[];
    activities: Team[];
  };
  console.log(teams);

  // get the dailyPoints array from each team and store in an array
  const teamDailyPoints = teams.map((team) => {
    return team.dailyPoints;
  });

  const combinedDaily = getDailyCombinedPoints(teamDailyPoints, [
    // team names come from the teams array
    ...teams.map((team) => team.name),
  ]);

  // create an object chartConfig
  // four keys with the team na,e and two properties: "label" (teamname) and "color" from the colors array
  const chartConfig = teams.reduce((config, team) => {
    config[team.name] = {
      label: team.name,
      color: team.color,
    };
    return config;
  }, {} as ChartConfig);

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
