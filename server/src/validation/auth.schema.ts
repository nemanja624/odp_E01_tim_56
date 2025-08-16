import { z } from "zod";
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(["STUDENT","PROFESSOR"]),
    courseIds: z.array(z.number().int()).max(3)
  })
});
export const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(6) })
});
