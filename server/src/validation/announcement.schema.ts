import { z } from "zod";
export const createAnnouncementSchema = z.object({
  params: z.object({ courseId: z.string().transform(Number) }),
  body: z.object({ title: z.string().optional(), content: z.string().min(1) })
});
export const updateAnnouncementSchema = z.object({
  params: z.object({ id: z.string().transform(Number) }),
  body: z.object({ title: z.string().optional(), content: z.string().min(1).optional() })
});
export const commentSchema = z.object({
  params: z.object({ id: z.string().transform(Number) }),
  body: z.object({ content: z.string().min(1) })
});
export const reactionSchema = z.object({
  params: z.object({ id: z.string().transform(Number) }),
  body: z.object({ value: z.enum(["LIKE","DISLIKE"]) })
});
