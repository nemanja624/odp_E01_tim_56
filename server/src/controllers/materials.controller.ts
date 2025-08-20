import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config.js';
import * as MatRepo from '../repositories/material.repo.js';
import * as CourseRepo from '../repositories/course.repo.js';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (_req, file, cb) => cb(null, config.uploadDirs.materials),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
function fileFilter(_req: any, file: Express.Multer.File, cb: any){
  if (file.mimetype !== 'application/pdf' && file.mimetype !== 'text/plain') {
    return cb(new Error('Only PDF or TXT allowed'), false);
  }
  cb(null, true);
}
export const uploadMaterial = multer({ storage, fileFilter });

export async function list(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const courseId = Number(req.params.courseId);
  if (!await CourseRepo.isUserEnrolled(user.id, courseId)) return res.status(403).json({ message: 'Not enrolled' });
  const rows = await MatRepo.listByCourse(courseId);
  res.json({ materials: rows });
}
export async function create(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const courseId = Number(req.params.courseId);
  if (!await CourseRepo.isUserEnrolled(user.id, courseId)) return res.status(403).json({ message: 'Not enrolled' });
  const { title, description } = req.body;
  const file = (req as any).file;
  if (!file) return res.status(400).json({ message: 'File required (PDF or TXT)' });
  const file_url = '/uploads/materials/' + file.filename;
  const id = await MatRepo.create(courseId, user.id, title, description, file_url, file.mimetype);
  const item = await MatRepo.getById(id);
  res.status(201).json({ material: item });
}
export async function remove(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const id = Number(req.params.id);
  const mat = await MatRepo.getById(id);
  if (!mat) return res.status(404).json({ message: 'Not found' });

  if (!await CourseRepo.isUserEnrolled(user.id, mat.course_id)) {
    return res.status(403).json({ message: 'Not enrolled' });
  }

  try {
    const filename = path.basename(mat.file_url);
    const abs = path.join(process.cwd(), 'src', 'uploads', 'materials', filename);
    await fs.promises.unlink(abs).catch(()=>{});
  } catch {}

  await MatRepo.removeById(id);
  res.json({ ok: true });
} // ovu funkciju sam dodao

export async function download(req: Request, res: Response){
  // @ts-ignore
  const user = req.user;
  const id = Number(req.params.id);
  const mat = await MatRepo.getById(id);
  if (!mat) return res.status(404).json({ message: 'Not found' });

  if (!await CourseRepo.isUserEnrolled(user.id, mat.course_id)) {
    return res.status(403).json({ message: 'Not enrolled' });
  }

  const filename = path.basename(mat.file_url); // npr. 17234.pdf
  const absPath = path.join(process.cwd(), 'src', 'uploads', 'materials', filename);

  return res.download(absPath, filename);
}
