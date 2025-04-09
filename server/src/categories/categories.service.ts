import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const getCategories = async () => {
  return await prisma.activityCategory.findMany({
    include: {
      Activity: true,
    },
  });
};

export const categoriesService = {
  getCategories,
};
