import { prisma } from "../db/prisma";
export const list = () => prisma.course.findMany({ orderBy:{ name:"asc" } });
export const byId = (id: number) => prisma.course.findUnique({ where:{ id } });
export const isUserEnrolled = (userId: number, courseId: number) => prisma.enrollment.findUnique({ where:{ userId_courseId:{ userId, courseId } } });
