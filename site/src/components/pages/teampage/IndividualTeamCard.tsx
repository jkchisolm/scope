import { LineChartCurved } from "@/components/charts/line-chart-curved";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Team } from "@/lib/types";
import { Link } from "@tanstack/react-router";

type Props = {
  team: Team;
};

export const TeamCard = ({ team }: Props) => {
  return (
    <Link to={"/teams/$teamId"} params={{ teamId: team.id }}>
      <Card key={team.id}>
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>
            {team.members
              .filter((member) => member.role === "EBOARD")
              .map((member) => member.name)
              .join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <LineChartCurved days={team.dailyPoints} />
          </div>
          <h2 className="font-extrabold text-3xl text-center">
            {team.points} points
          </h2>
          <h2 className="font-bold">Members</h2>
          {team.members
            .filter((member) => member.role === "MEMBER")
            .map((member) => (
              <div
                key={member.id}
                className="font-medium text-neutral-500 text-sm"
              >
                {member.name}
              </div>
            ))}
        </CardContent>
      </Card>
    </Link>
  );
};
