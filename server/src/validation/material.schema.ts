import { z } from "zod";
export const createMaterialSchema = z.object({
  params: z.object({ courseId: z.string().transform(Number) }),
  body: z.object({ title: z.string().min(1), description: z.string().optional() })
});
