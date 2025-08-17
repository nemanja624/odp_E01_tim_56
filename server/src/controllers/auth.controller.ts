import { Request, Response } from "express";
import * as svc from "../services/auth.service.js";
import { env } from "../config/env.js";

export async function register(req: Request, res: Response){
  const user = await svc.register(req.body);
  res.status(201).json({ id:user.id, email:user.email });
}

export async function login(req: Request, res: Response){
  const { token, user } = await svc.login(req.body.email, req.body.password);
  res.cookie(env.COOKIE_NAME, token, { httpOnly:true, sameSite:"lax", secure:false, maxAge:7*24*3600*1000 });
  res.json({ user });
}

export function logout(_req: Request, res: Response){
  res.clearCookie(env.COOKIE_NAME); res.json({ ok:true });
}

export async function me(req: Request, res: Response){
  const enrolls = await svc.me((req as any).user.id);
  res.json({ user: (req as any).user, enrollments: enrolls });
}
