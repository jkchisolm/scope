import { DataTable } from "@/components/DataTable";
import {
  ActivityColumns,
  MemberColumns,
} from "@/components/pages/teams/columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamQueries } from "@/lib/queries/TeamQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle, UserPlus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  const { data: team } = useSuspenseQuery(TeamQueries.getSingleTeam(teamId));

  console.log(team);

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
            <Badge variant="outline">{member.name}</Badge>
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
            <Button variant="outline">
              <PlusCircle />
              Add Activity
            </Button>
            <Button variant="outline" className="ml-2">
              <UserPlus />
              Add Member
            </Button>
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
