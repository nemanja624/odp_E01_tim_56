import * as repo from "../repositories/announcement.repo.js";
import * as course from "../repositories/course.repo.js";
import { prisma } from "../db/prisma.js";
import { Forbidden, NotFound } from "../core/errors.js";
import fs from "fs/promises";
import path from "path";

export async function list(
  courseId: number,
  user: { id: number; role: "STUDENT" | "PROFESSOR" }
) {
  const enrolled = await course.isUserEnrolled(user.id, courseId);
  if (!enrolled) throw Forbidden("Not enrolled in this course");
  return repo.listByCourse(courseId);
}

export async function create(input: {
  courseId: number;
  authorId: number;
  title?: string;
  content: string;
  imageUrl?: string;
}) {
  const enrolled = await course.isUserEnrolled(input.authorId, input.courseId);
  if (!enrolled) throw Forbidden("Professor not enrolled in course");
  return repo.create(input);
}

export async function remove(id: number, authorId: number) {
  const ann = await repo.byId(id);
  if (!ann) throw NotFound("Announcement not found");
  if (ann.authorId !== authorId)
    throw Forbidden("Only author professor can delete");

  // 1) obriši reakcije i komentare (FK safety)
  await prisma.$transaction([
    prisma.reaction.deleteMany({ where: { announcementId: id } }),
    prisma.comment.deleteMany({ where: { announcementId: id } }),
  ]);

  // 2) ako ima sliku – obriši fajl
  if (ann.imageUrl) {
    const filename = ann.imageUrl.split("/").pop();
    if (filename) {
      const filePath = path.join(
        process.cwd(),
        "src",
        "uploads",
        "images",
        filename
      );
      try {
        await fs.unlink(filePath);
      } catch {
        /* ignore if already gone */
      }
    }
  }

  // 3) obriši obaveštenje
  await repo.remove(id);
  return { ok: true };
}

export async function update(
  id: number,
  authorId: number,
  data: Partial<{ title: string; content: string; imageUrl: string }>
) {
  const ann = await repo.byId(id);
  if (!ann || ann.authorId !== authorId)
    throw Forbidden("Only author professor can edit");
  return repo.update(id, data);
}

export async function comments(announcementId: number) {
  return repo.listComments(announcementId);
}
export async function addComment(
  announcementId: number,
  userId: number,
  content: string
) {
  return repo.addComment(announcementId, userId, content);
}
export async function updateComment(
  commentId: number,
  _userId: number,
  content: string
) {
  // (po želji možeš dodati proveru vlasništva)
  return repo.updateComment(commentId, content);
}
export async function deleteComment(commentId: number) {
  return repo.deleteComment(commentId);
}

export async function react(
  announcementId: number,
  userId: number,
  value: "LIKE" | "DISLIKE"
) {
  return repo.setReaction(announcementId, userId, value);
}
export async function unreact(announcementId: number, userId: number) {
  return repo.deleteReaction(announcementId, userId);
}
export async function reactionCounts(announcementId: number) {
  return repo.countReactions(announcementId);
}
