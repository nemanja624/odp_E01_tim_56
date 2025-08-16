import { prisma } from "../db/prisma";
export const listByCourse = (courseId: number) => prisma.announcement.findMany({
  where:{ courseId }, orderBy:{ createdAt:"desc" }, include:{ author:true, _count:{ select:{ comments:true, reactions:true } } }
});
export const create = (data: { courseId:number; authorId:number; title?:string; content:string; imageUrl?:string; }) => prisma.announcement.create({ data });
export const update = (id:number, data: Partial<{title:string; content:string; imageUrl:string}>) => prisma.announcement.update({ where:{ id }, data });
export const byId = (id:number) => prisma.announcement.findUnique({ where:{ id } });
export const remove = (id:number) => prisma.announcement.delete({ where:{ id } });

export const addComment = (announcementId:number, userId:number, content:string) => prisma.comment.create({ data:{ announcementId, userId, content } });
export const listComments = (announcementId:number) => prisma.comment.findMany({ where:{ announcementId }, include:{ user:true }, orderBy:{ createdAt:"asc" } });
export const updateComment = (id:number, content:string) => prisma.comment.update({ where:{ id }, data:{ content } });
export const deleteComment = (id:number) => prisma.comment.delete({ where:{ id } });

export const setReaction = async (announcementId:number, userId:number, value:"LIKE"|"DISLIKE") => {
  return prisma.reaction.upsert({
    where:{ announcementId_userId:{ announcementId, userId } },
    update:{ value },
    create:{ announcementId, userId, value }
  });
};
export const deleteReaction = (announcementId:number, userId:number) => prisma.reaction.delete({ where:{ announcementId_userId:{ announcementId, userId } } });
export const countReactions = (announcementId:number) => prisma.reaction.groupBy({ by:["value"], where:{ announcementId }, _count:{ value:true } });
