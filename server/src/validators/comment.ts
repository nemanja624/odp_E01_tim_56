import { z } from 'zod';
export const commentCreateSchema = z.object({
  body: z.object({ body: z.string().min(1) }),
  params: z.object({ id: z.string().regex(/^\d+$/) })
});
export const commentUpdateSchema = z.object({
  body: z.object({ body: z.string().min(1) }),
  params: z.object({ id: z.string().regex(/^\d+$/) })
});
