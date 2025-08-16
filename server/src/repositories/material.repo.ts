import { prisma } from "../db/prisma";
export const listByCourse = (courseId:number) => prisma.material.findMany({ where:{ courseId }, orderBy:{ createdAt:"desc" } });
export const create = (data:{ courseId:number; title:string; description?:string; fileUrl:string; mimeType:string; uploadedBy:number; }) => prisma.material.create({ data });
export const remove = (id:number) => prisma.material.delete({ where:{ id } });
export const byId = (id:number) => prisma.material.findUnique({ where:{ id } });
