import { Router } from "express";
import { asyncHandler } from "../core/http";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { enrollSchema } from "../validation/course.schema";
import * as ctrl from "../controllers/course.controller";

const r = Router();
r.get("/", asyncHandler(ctrl.list));
r.post("/enroll", requireAuth, validate(enrollSchema), asyncHandler(ctrl.enroll));

export default r;
