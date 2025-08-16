import * as repo from "../repositories/announcement.repo";
import * as course from "../repositories/course.repo";
import { Forbidden } from "../core/errors";

export async function list(courseId:number, user:{id:number; role:"STUDENT"|"PROFESSOR"}){
  const enrolled = await course.isUserEnrolled(user.id, courseId);
  if(!enrolled) throw new Forbidden("Not enrolled in this course");
  return repo.listByCourse(courseId);
}

export async function create(input:{ courseId:number; authorId:number; title?:string; content:string; imageUrl?:string; }){
  const enrolled = await course.isUserEnrolled(input.authorId, input.courseId);
  if(!enrolled) throw new Forbidden("Professor not enrolled in course");
  return repo.create(input);
}

export async function update(id:number, authorId:number, data: Partial<{title:string; content:string; imageUrl:string}>){
  const ann = await repo.byId(id);
  if(!ann || ann.authorId !== authorId) throw new Forbidden("Only author professor can edit");
  return repo.update(id, data);
}

export async function comments(announcementId:number){ return repo.listComments(announcementId); }
export async function addComment(announcementId:number, userId:number, content:string){ return repo.addComment(announcementId, userId, content); }
export async function updateComment(commentId:number, userId:number, content:string){
  const list = await repo.updateComment(commentId, content); return list;
}
export async function deleteComment(commentId:number){ return repo.deleteComment(commentId); }

export async function react(announcementId:number, userId:number, value:"LIKE"|"DISLIKE"){ return repo.setReaction(announcementId, userId, value); }
export async function unreact(announcementId:number, userId:number){ return repo.deleteReaction(announcementId, userId); }
export async function reactionCounts(announcementId:number){ return repo.countReactions(announcementId); }
