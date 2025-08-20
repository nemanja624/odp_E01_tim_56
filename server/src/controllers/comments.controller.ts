import { Request, Response } from 'express';
import * as CommentRepo from '../repositories/comment.repo.js';
import * as AnnRepo from '../repositories/announcement.repo.js';

export async function list(req: Request, res: Response){
  const annId = Number(req.params.id);
  const rows = await CommentRepo.listByAnnouncement(annId);
  res.json({ comments: rows });
}
export async function create(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const annId = Number(req.params.id);
  const id = await CommentRepo.create(annId, user.id, req.body.body);
  const rows = await CommentRepo.listByAnnouncement(annId);
  res.status(201).json({ comments: rows, createdId: id });
}
export async function update(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const id = Number(req.params.id);
  await CommentRepo.update(id, user.id, req.body.body);
  res.json({ ok: true });
}
export async function remove(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const id = Number(req.params.id);
  await CommentRepo.remove(id, user.id);
  res.json({ ok: true });
}
