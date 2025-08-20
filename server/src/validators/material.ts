import { z } from 'zod';
export const materialCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional()
  }),
  params: z.object({ courseId: z.string().regex(/^\d+$/) })
});
