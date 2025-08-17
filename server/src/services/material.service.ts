import * as repo from "../repositories/material.repo";
import * as course from "../repositories/course.repo";
import { Forbidden } from "../core/errors";

export async function list(courseId:number, userId:number){
  const enrolled = await course.isUserEnrolled(userId, courseId);
  if(!enrolled) throw Forbidden("Not enrolled");
  return repo.listByCourse(courseId);
}

export async function create(input:{ courseId:number; title:string; description?:string; fileUrl:string; mimeType:string; uploadedBy:number }){
  const enrolled = await course.isUserEnrolled(input.uploadedBy, input.courseId);
  if(!enrolled) throw Forbidden("Professor not enrolled in course");
  return repo.create(input);
}

export const remove = repo.remove;
export const byId = repo.byId;
