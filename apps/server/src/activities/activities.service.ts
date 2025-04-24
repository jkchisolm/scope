import { PrismaClient } from "@prisma/client";
import {
  type CreateActivityBody,
  type CreateBatchActivityBody,
} from "@workspace/shared";

const prisma = new PrismaClient();

const createActivity = async (data: CreateActivityBody) => {
  // Update the corresponding team's points
  // In the future, this will need to be expanded to support lunch buddies but for now we'll just update the team's points

  await prisma.team.update({
    where: {
      id: data.teamId,
    },
    data: {
      points: {
        increment: data.points,
      },
    },
  });

  return prisma.activity.create({
    data: {
      name: data.name,
      points: data.points,
      date: new Date(data.date),
      teamId: data.teamId,
      categoryId: data.categoryId,
      // participants: {
      //   create: data.members.map((member) => ({
      //     memberId: member.memberId,
      //     points: member.points,
      //   })),
      // },
    },
  });
};

const createBatchActivity = async (data: CreateBatchActivityBody) => {
  console.log(data);
  const list = data.list as CreateActivityBody[];
  if (!list || list.length === 0) {
    throw new Error("No activities provided");
  }

  const totalPoints = list.reduce((acc, activity) => acc + activity.points, 0); // sum points for all activities\

  console.log(totalPoints);

  // Update the corresponding team's points
  await prisma.team.update({
    where: {
      id: list[0]?.teamId ?? "", // assuming all activities are for the same team
    },
    data: {
      points: {
        increment: totalPoints,
      },
    },
  });

  return await prisma.activity.createMany({
    data: list,
  });
};

const getActivitiesForTeam = (teamId: string) => {
  return prisma.activity.findMany({
    where: {
      teamId,
    },
  });
};

const getActivitiesForMember = (memberId: string) => {
  return prisma.activity.findMany({
    where: {
      ActivityMember: {
        some: {
          memberId,
        },
      },
    },
  });
};

const getActivities = () => {
  return prisma.activity.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      Team: true,
    },
  });
};

export const activityService = {
  createActivity,
  createBatchActivity,
  getActivitiesForTeam,
  getActivitiesForMember,
  getActivities,
};
