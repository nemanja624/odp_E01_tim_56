import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config.js';
import * as AnnRepo from '../repositories/announcement.repo.js';
import * as CourseRepo from '../repositories/course.repo.js';

const storage = multer.diskStorage({
  destination: (_req, file, cb) => cb(null, config.uploadDirs.images),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
function imageFilter(_req:any,file:any,cb:any){
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false);
  cb(null, true);
}
export const uploadImage = multer({ storage, fileFilter: imageFilter });

export async function list(req:Request,res:Response){
  // @ts-ignore
  const user = req.user;
  const courseId = Number(req.params.courseId);
  if (!await CourseRepo.isUserEnrolled(user.id, courseId)) return res.status(403).json({ message: 'Not enrolled' });
  const rows = await AnnRepo.listByCourse(courseId, user.id);
  res.json({ announcements: rows });
}
export async function create(req:Request,res:Response){
  // @ts-ignore
  const user = req.user;
  const courseId = Number(req.params.courseId);
  if (!await CourseRepo.isUserEnrolled(user.id, courseId)) return res.status(403).json({ message: 'Not enrolled' });
  const { title, body } = req.body;
  const image_url = (req as any).file ? '/uploads/images/' + (req as any).file.filename : undefined;
  const id = await AnnRepo.create(courseId, user.id, title, body, image_url);
  const ann = await AnnRepo.getById(id);
  res.status(201).json({ announcement: ann });
}
export async function update(req:Request,res:Response){
  // @ts-ignore
  const user = req.user;
  const id = Number(req.params.id);
  const ann = await AnnRepo.getById(id);
  if (!ann) return res.status(404).json({ message: 'Not found' });
  if (ann.user_id !== user.id) return res.status(403).json({ message: 'Not your announcement' });
  await AnnRepo.update(id, req.body.title, req.body.body);
  const fresh = await AnnRepo.getById(id);
  res.json({ announcement: fresh });
}
export async function remove(req:Request,res:Response){
  // @ts-ignore
  const user = req.user;
  await AnnRepo.remove(Number(req.params.id), user.id);
  res.json({ ok: true });
}
export async function react(req:Request,res:Response){
  // @ts-ignore
  const user = req.user;
  const id = Number(req.params.id);
  await AnnRepo.setReaction(id, user.id, req.body.type);
  res.json({ ok: true });
}
