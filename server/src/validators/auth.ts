import { z } from 'zod';
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['PROFESSOR','STUDENT']),
    courseIds: z.array(z.number()).min(1).max(3)
  })
});
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});
