import { PrismaClient } from "../generated/prisma/client";
import { type CreateTeamInput } from "@workspace/shared";
import { getTeamCumulativePoints } from "../lib/utils";

const prisma = new PrismaClient();

const getAllTeams = async () => {
  const teams = await prisma.team.findMany({
    include: {
      Member: true,
      Activity: true,
    },
  });

  const attendance = await prisma.meetingAttendance.findMany({
    include: {
      Member: true,
    },
  });

  const teamsWithDailyPoints = teams.map((team) => {
    const dailyPoints = getTeamCumulativePoints({
      ...team,
      activities: team.Activity,
      meetingAttendance: attendance
        .filter((att) => att.teamId === team.id)
        .map(({ date, attended, isExcused }) => ({
          date: date.toISOString(),
          attended,
          isExcused,
        })),
    });
    return {
      ...team,
      dailyPoints,
    };
  });

  return teamsWithDailyPoints;
};

const getTeam = async (teamId: string) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      Member: true,
      Activity: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const attendance = await prisma.meetingAttendance.findMany({
    where: {
      teamId: teamId,
    },
  });

  const dailyPoints = getTeamCumulativePoints({
    ...team,
    activities: team.Activity,
    meetingAttendance: attendance.map(({ date, attended, isExcused }) => ({
      date: date.toISOString(),
      attended,
      isExcused,
    })),
  });

  return {
    ...team,
    dailyPoints,
  };
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
  getTeam,
  createTeam,
};
