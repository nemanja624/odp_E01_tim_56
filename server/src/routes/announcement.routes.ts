import { Router } from "express";
import multer from "multer";
import path from "path";
import { asyncHandler } from "../core/http";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createAnnouncementSchema, updateAnnouncementSchema, commentSchema, reactionSchema } from "../validation/announcement.schema";
import * as ctrl from "../controllers/announcement.controller";

const r = Router();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "server", "src", "uploads", "images")),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, fileFilter: (_req, file, cb) => {
  const ok = ["image/png","image/jpeg","image/jpg"].includes(file.mimetype);
  cb(ok? null : new Error("Only PNG/JPEG"), ok);
}});

r.get("/course/:courseId", requireAuth, asyncHandler(ctrl.listByCourse));
r.post("/course/:courseId", requireAuth, requireRole("PROFESSOR"), upload.single("image"), validate(createAnnouncementSchema), asyncHandler((req,res)=>{ (req as any).fileUrl = req.file? `/static/images/${req.file.filename}` : undefined; return ctrl.create(req,res); }));
r.put("/:id", requireAuth, requireRole("PROFESSOR"), validate(updateAnnouncementSchema), asyncHandler(ctrl.update));
r.get("/:id/comments", requireAuth, asyncHandler(ctrl.comments));
r.post("/:id/comments", requireAuth, validate(commentSchema), asyncHandler(ctrl.addComment));
r.put("/:id/comments/:commentId", requireAuth, asyncHandler(ctrl.updateComment));
r.delete("/:id/comments/:commentId", requireAuth, asyncHandler(ctrl.deleteComment));
r.get("/:id/reactions", requireAuth, asyncHandler(ctrl.reactionCounts));
r.post("/:id/reactions", requireAuth, validate(reactionSchema), asyncHandler(ctrl.react));
r.delete("/:id/reactions", requireAuth, asyncHandler(ctrl.unreact));

export default r;
