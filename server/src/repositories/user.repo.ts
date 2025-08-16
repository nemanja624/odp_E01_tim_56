import { prisma } from "../db/prisma";
export const findByEmail = (email: string) => prisma.user.findUnique({ where:{ email } });
export const create = (data: {email:string;passwordHash:string;name:string;role:"STUDENT"|"PROFESSOR"}) => prisma.user.create({ data });
export const enroll = async (userId: number, courseIds: number[]) => {
  const current = await prisma.enrollment.count({ where:{ userId } });
  if(current + courseIds.length > 3) throw new Error("Max 3 courses per user");
  return prisma.$transaction(courseIds.map(cid => prisma.enrollment.upsert({
    where:{ userId_courseId: { userId, courseId: cid } },
    update:{}, create:{ userId, courseId: cid }
  })));
};
export const getEnrollments = (userId: number) => prisma.enrollment.findMany({ where:{ userId }, include:{ course:true } });
