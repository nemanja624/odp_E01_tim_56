import { z } from 'zod';
export const announcementCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    body: z.string().min(1).optional()
  }),
  params: z.object({ courseId: z.string().regex(/^\d+$/) })
});
export const announcementUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional()
  }),
  params: z.object({ id: z.string().regex(/^\d+$/) })
});
export const reactionSchema = z.object({
  body: z.object({ type: z.enum(['LIKE','DISLIKE']) }),
  params: z.object({ id: z.string().regex(/^\d+$/) })
});
