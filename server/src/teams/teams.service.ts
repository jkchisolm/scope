import { PrismaClient } from "../../generated/prisma";
import { CreateTeamInput } from "../../lib/types";
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

const createTeam = async (team: CreateTeamInput) => {
  // Create a new team with name and description
  // Create a bunch of members with the information from the input
  try {
    // Create team
    const newTeam = await prisma.team.create({
      data: {
        name: team.name,
        color: team.color,
        active: team.active,
        points: 0,
      },
    });

    console.log("newTeam", newTeam);

    // Create members
    // We can use Prisma's createMany

    const members = team.members.map((member) => ({
      name: member.name,
      role: member.role,
      teamId: newTeam.id,
    }));

    console.log("members", members);

    await prisma.member.createMany({
      data: members,
    });

    return newTeam;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const teamsService = {
  getAllTeams,
  createTeam,
};
