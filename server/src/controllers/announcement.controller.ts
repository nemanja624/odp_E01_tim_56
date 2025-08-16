import { Request, Response } from "express";
import * as svc from "../services/announcement.service";

export const listByCourse = async (req:Request, res:Response) => {
  const courseId = Number(req.params.courseId);
  const user = (req as any).user;  
  const data = await svc.list(courseId, user);
  res.json(data);
};

export const create = async (req:Request, res:Response) => {
  const courseId = Number(req.params.courseId);
  const { title, content } = req.body as any;
  const imageUrl = (req as any).fileUrl as string | undefined;
  const data = await svc.create({ courseId, authorId: (req as any).user.id, title, content, imageUrl });
  res.status(201).json(data);
};

export const update = async (req:Request, res:Response) => {
  const id = Number(req.params.id);
  const { title, content } = req.body as any;
  const data = await svc.update(id, (req as any).user.id, { title, content });
  res.json(data);
};

export const comments = async (req:Request, res:Response) => res.json(await svc.comments(Number(req.params.id)));
export const addComment = async (req:Request, res:Response) => res.status(201).json(await svc.addComment(Number(req.params.id),(req as any).user.id, req.body.content));
export const updateComment = async (req:Request, res:Response) => res.json(await svc.updateComment(Number(req.params.commentId),(req as any).user.id, req.body.content));
export const deleteComment = async (req:Request, res:Response) => { await svc.deleteComment(Number(req.params.commentId)); res.status(204).send(); };

export const react = async (req:Request, res:Response) => res.json(await svc.react(Number(req.params.id),(req as any).user.id, req.body.value));
export const unreact = async (req:Request, res:Response) => { await svc.unreact(Number(req.params.id),(req as any).user.id); res.status(204).send(); };
export const reactionCounts = async (req:Request, res:Response) => res.json(await svc.reactionCounts(Number(req.params.id)));
