import { QueryClient } from "@tanstack/react-query";
import { href, useLoaderData, useNavigate } from "react-router";
import { AddTeamDialog } from "~/components/pages/teams/AddTeamDialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { TeamQueries } from "~/lib/queries/TeamQueries";

export async function clientLoader() {
  const queryClient = new QueryClient();
  const data = await queryClient.ensureQueryData(TeamQueries.getAllTeams);

  return data;
}

export default function Teams() {
  const teams = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-start items-center w-full gap-4 p-5">
      <AddTeamDialog />

      <div className="w-full">
        <h1 className="text-3xl font-bold">Current Semester</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-rows-4 md:grid-rows-2 lg:grid-rows-1 gap-10 my-5">
          {teams.map((team) => (
            <Card
              onClick={() =>
                navigate(href("/teams/:teamId", { teamId: team.id }))
              }
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
