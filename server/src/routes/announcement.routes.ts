import { Router } from "express";
import multer from "multer";
import path from "path";
import { asyncHandler } from "../core/http.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  commentSchema,
  reactionSchema,
} from "../validation/announcement.schema.js";
import * as ctrl from "../controllers/announcement.controller.js";

const r = Router();

/** Multer storage za slike obaveštenja */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(process.cwd(), "src", "uploads", "images")),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PNG/JPEG"), ok);
  },
});

/** List obaveštenja po kursu (mora biti upisan na kurs) */
r.get("/course/:courseId", requireAuth, asyncHandler(ctrl.listByCourse));

/** Kreiranje obaveštenja (samo PROFESOR, opcionalna slika) */
r.post(
  "/course/:courseId",
  requireAuth,
  requireRole("PROFESSOR"),
  upload.single("image"),
  validate(createAnnouncementSchema),
  asyncHandler((req, res) => {
    if (req.file) {
      (req as any).fileUrl = `/static/images/${req.file.filename}`;
    }
    return ctrl.create(req, res);
  })
);

/** Izmena obaveštenja (samo autor–profesor) */
r.put(
  "/:id",
  requireAuth,
  requireRole("PROFESSOR"),
  validate(updateAnnouncementSchema),
  asyncHandler(ctrl.update)
);

/** Brisanje obaveštenja (samo autor–profesor) */
r.delete(
  "/:id",
  requireAuth,
  requireRole("PROFESSOR"),
  asyncHandler(ctrl.remove)
);

/** Komentari */
r.get("/:id/comments", requireAuth, asyncHandler(ctrl.comments));
r.post(
  "/:id/comments",
  requireAuth,
  validate(commentSchema),
  asyncHandler(ctrl.addComment)
);
r.put(
  "/:id/comments/:commentId",
  requireAuth,
  asyncHandler(ctrl.updateComment)
);
r.delete(
  "/:id/comments/:commentId",
  requireAuth,
  asyncHandler(ctrl.deleteComment)
);

/** Reakcije */
r.get("/:id/reactions", requireAuth, asyncHandler(ctrl.reactionCounts));
r.post(
  "/:id/reactions",
  requireAuth,
  validate(reactionSchema),
  asyncHandler(ctrl.react)
);
r.delete("/:id/reactions", requireAuth, asyncHandler(ctrl.unreact));

export default r;
