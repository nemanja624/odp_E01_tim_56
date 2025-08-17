import { Router } from "express";
import multer from "multer";
import path from "path";
import { asyncHandler } from "../core/http";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createMaterialSchema } from "../validation/material.schema";
import * as ctrl from "../controllers/material.controller";

const r = Router();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "src", "uploads", "materials")),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, fileFilter: (_req, file, cb) => {
  const ok = ["application/pdf","text/plain"].includes(file.mimetype);
  cb(ok? null : new Error("Only PDF/TXT"), ok);
}});

r.get("/course/:courseId", requireAuth, asyncHandler(ctrl.listByCourse));
r.post("/course/:courseId", requireAuth, requireRole("PROFESSOR"), upload.single("file"), validate(createMaterialSchema), asyncHandler((req,res)=>{ (req as any).fileUrl = `/static/materials/${req.file!.filename}`; (req as any).mimeType = req.file!.mimetype; return ctrl.create(req,res); }));
r.delete("/:id", requireAuth, requireRole("PROFESSOR"), asyncHandler(ctrl.remove));
export default r;
