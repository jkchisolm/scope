import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div
      className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 
    grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 
    *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6"
    >
      {sortedTeams.map((team) => (
        <Card
          className="@container/card"
          key={team.name}
          style={{ backgroundColor: `${team.color}22` }}
        >
          <CardHeader className="relative">
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.points} points</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default TeamCards;
