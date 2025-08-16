import { z } from "zod";
export const enrollSchema = z.object({ body: z.object({ courseIds: z.array(z.number().int()).min(1).max(3) }) });
