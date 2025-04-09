import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Props = {
  teams: {
    name: string;
    color: string;
    points: number;
  }[];
};

const TeamCards = (props: Props) => {
  const sortedTeams = props.teams.sort((a, b) => {
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });

  return (
    <>
      {sortedTeams.map((team) => (
        <Card style={{ backgroundColor: team.color }} key={team.name}>
          <CardContent className="flex flex-row justify-center items-center w-full h-full flex flex-col gap-4">
            <h2 className="text-4xl font-bold">{team.name}</h2>
            <h3>{team.points}</h3>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default TeamCards;
