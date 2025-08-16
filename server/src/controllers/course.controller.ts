import { Request, Response } from "express";
import * as svc from "../services/course.service";

export const list = async (_req:Request, res:Response) => res.json(await svc.list());
export const enroll = async (req:Request, res:Response) => {
  const userId = (req as any).user.id as number;
  const { courseIds } = req.body as { courseIds:number[] };
  const data = await svc.enroll(userId, courseIds);
  res.status(201).json({ ok:true, count: data.length });
};
