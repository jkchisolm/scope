import { QueryClient } from "@tanstack/react-query";
import type { Team } from "@workspace/shared";
import { GraduationCap, UserPlus } from "lucide-react";
import { href, Link, useLoaderData } from "react-router";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AddActivityDialog } from "~/components/pages/teams/AddActivityDialog";
import { DataTable } from "~/components/table/DataTable";
import {
  ActivityColumns,
  MemberColumns,
} from "~/components/table/DataTableColumns";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TeamQueries } from "~/lib/queries/TeamQueries";
import type { Route } from "../+types/[teamId]";
import { Badge } from "~/components/ui/badge";

export async function clientLoader({
  params,
}: Route.LoaderArgs): Promise<Team> {
  const queryClient = new QueryClient();
  const data = await queryClient.ensureQueryData(
    TeamQueries.getSingleTeam(params.teamId)
  );

  return data;
}

export default function Team() {
  const team = useLoaderData<typeof clientLoader>();

  const chartConfig = {
    value: {
      label: team.name,
      color: team.color,
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-4xl font-bold">{team.name}</h1>
        <h1 className="text-4xl font-bold">{team.points} points</h1>
      </div>
      <div className="flex flex-row gap-2">
        {team.Member.filter((member) => member.role === "EBOARD").map(
          (member) => (
            <Badge variant="outline" key={member.name}>
              {member.name}
            </Badge>
          )
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
          <CardDescription>
            Point history for team, from the start of scope cup.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={team.dailyPoints}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="value"
                type="natural"
                fill={chartConfig.value.color}
                fillOpacity={0.4}
                stroke={chartConfig.value.color}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Tabs defaultValue="activites" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="activites">Activities</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          <div className="flex items-center">
            <AddActivityDialog teamId={team.id} />
            <Button variant="outline" className="ml-2">
              <UserPlus />
              Add Member
            </Button>
            <Link
              to={{
                pathname: href("/teams/:teamId/attendance", {
                  teamId: team.id,
                }),
                search: "?creationDate=" + new Date(team.createdAt).toString(),
              }}
            >
              <Button variant="outline" className="ml-2">
                <GraduationCap />
                Manage Attendance
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="activites">
          <DataTable columns={ActivityColumns} data={team.Activity} />
        </TabsContent>
        <TabsContent value="members">
          <DataTable columns={MemberColumns} data={team.Member} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
