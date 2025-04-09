import { AddTeamDialog } from "@/components/pages/teampage/AddTeamDialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TeamQueries } from "@/lib/queries/TeamQueries";
import type { Team } from "@/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(TeamQueries.getAllTeams),
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 200,
});

function RouteComponent() {
  const router = useRouter();

  const { data } = useSuspenseQuery(TeamQueries.getAllTeams);
  const teams = data as Team[];

  console.log(teams);
  // get the dailyPoints array from each team and store in an array

  return (
    <div className="flex flex-col justify-start items-center w-full gap-4 p-5">
      <AddTeamDialog />

      <div className="w-full">
        <h1 className="text-3xl font-bold">Current Semester</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-rows-4 md:grid-rows-2 lg:grid-rows-1 gap-10 my-5">
          {teams.map((team) => (
            <Card
              onClick={() => router.navigate({ to: `/teams/${team.id}` })}
              key={team.id}
              className="hover:cursor-pointer hover:scale-105 transition-transform"
            >
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  {team.Member.filter((member) => member.role === "EBOARD")
                    .map((member) => member.name)
                    .join(", ")}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <h1 className="text-3xl font-bold">Past Semesters</h1>
        {/** TODO */}
      </div>
    </div>
  );
}
