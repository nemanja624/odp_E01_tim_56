import { Router } from "express";
import { asyncHandler } from "../core/http";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validation/auth.schema";
import * as ctrl from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const r = Router();
r.post("/register", validate(registerSchema), asyncHandler(ctrl.register));
r.post("/login", validate(loginSchema), asyncHandler(ctrl.login));
r.post("/logout", asyncHandler(ctrl.logout));
r.get("/me", requireAuth, asyncHandler(ctrl.me));
export default r;
