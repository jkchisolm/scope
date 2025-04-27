import { PrismaClient } from "../../generated/client";

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
