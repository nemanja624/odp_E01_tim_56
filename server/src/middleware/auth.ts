import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JWTPayload = { id: number; role: "STUDENT" | "PROFESSOR" };

export function requireAuth(req: Request, res: Response, next: NextFunction){
  const token = req.cookies?.[env.COOKIE_NAME];
  if(!token) return res.status(401).json({message:"Unauthorized"});
  try{
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    (req as any).user = payload;
    next();
  }catch{
    return res.status(401).json({message:"Invalid token"});
  }
}
