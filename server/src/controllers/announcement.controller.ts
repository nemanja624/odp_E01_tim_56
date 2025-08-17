import { Request, Response } from "express";
import * as svc from "../services/announcement.service.js";

export const listByCourse = async (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);
  const user = (req as any).user;
  const data = await svc.list(courseId, user);
  res.json(data);
};

export const create = async (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);
  const { title, content } = req.body as any;
  const imageUrl = (req as any).fileUrl as string | undefined;
  const data = await svc.create({
    courseId,
    authorId: (req as any).user.id,
    title,
    content,
    imageUrl,
  });
  res.status(201).json(data);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, content } = req.body as any;
  const data = await svc.update(id, (req as any).user.id, { title, content });
  res.json(data);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await svc.remove(id, (req as any).user.id);
  res.status(204).send();
};

export const comments = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  res.json(await svc.comments(id));
};

export const addComment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const content = (req.body as any).content as string;
  const result = await svc.addComment(id, (req as any).user.id, content);
  res.status(201).json(result);
};

export const updateComment = async (req: Request, res: Response) => {
  const commentId = Number(req.params.commentId);
  const content = (req.body as any).content as string;
  const result = await svc.updateComment(commentId, (req as any).user.id, content);
  res.json(result);
};

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = Number(req.params.commentId);
  await svc.deleteComment(commentId);
  res.status(204).send();
};

export const react = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const value = (req.body as any).value as "LIKE" | "DISLIKE";
  const result = await svc.react(id, (req as any).user.id, value);
  res.json(result);
};

export const unreact = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await svc.unreact(id, (req as any).user.id);
  res.status(204).send();
};

export const reactionCounts = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await svc.reactionCounts(id);
  res.json(result);
};
