import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

const getRules = async () => {
  return await prisma.activityCategory.findMany({
    include: {
      Activity: true,
    },
  });
};

export const rulesService = {
  getRules,
};
