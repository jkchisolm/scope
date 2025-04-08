import { PrismaClient } from "../../generated/prisma";
import { getTeamCumulativePoints } from "../../lib/utils";

const prisma = new PrismaClient();

const getAllTeams = async () => {
  const teams = await prisma.team.findMany({
    include: {
      Member: true,
      Activity: true,
    },
  });

  const teamsWithDailyPoints = teams.map((team) => {
    const dailyPoints = getTeamCumulativePoints({
      ...team,
      activities: team.Activity,
    });
    return {
      ...team,
      dailyPoints,
    };
  });

  return teamsWithDailyPoints;
};

export const teamsService = {
  getAllTeams,
};
