import { Request, Response } from 'express';
import * as Courses from '../repositories/course.repo.js';
export async function list(_req:Request,res:Response){
  const courses = await Courses.listCourses();
  res.json({ courses });
}
