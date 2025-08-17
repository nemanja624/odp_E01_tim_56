import * as users from "../repositories/user.repo.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";

export async function register(input: {email:string;password:string;name:string;role:"STUDENT"|"PROFESSOR"; courseIds:number[]}){
  const exists = await users.findByEmail(input.email);
  if(exists) throw new Error("Email already in use");
  if(input.courseIds.length > 3) throw new Error("Max 3 courses");
  const hash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({ data:{ email: input.email, passwordHash: hash, name: input.name, role: input.role } });
  await users.enroll(user.id, input.courseIds);
  return user;
}

export async function login(email:string, password:string){
  const user = await users.findByEmail(email);
  if(!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) throw new Error("Invalid credentials");
  const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id:user.id, email:user.email, name:user.name, role:user.role } };
}

export async function me(userId:number){
  const enrollments = await users.getEnrollments(userId);
  return enrollments;
}
