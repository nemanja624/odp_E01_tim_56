import { Request, Response } from "express";
import * as svc from "../services/material.service";

export const listByCourse = async (req:Request, res:Response) => {
  const courseId = Number(req.params.courseId);
  const userId = (req as any).user.id as number;
  res.json(await svc.list(courseId, userId));
};

export const create = async (req:Request, res:Response) => {
  const courseId = Number(req.params.courseId);
  const { title, description } = req.body as any;
  const fileUrl = (req as any).fileUrl as string;
  const mimeType = (req as any).mimeType as string;
  res.status(201).json(await svc.create({ courseId, title, description, fileUrl, mimeType, uploadedBy: (req as any).user.id }));
};

export const remove = async (req:Request, res:Response) => { await svc.remove(Number(req.params.id)); res.status(204).send(); };
