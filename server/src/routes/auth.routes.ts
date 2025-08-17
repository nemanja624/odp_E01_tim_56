import { Router } from "express";
import { asyncHandler } from "../core/http.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validation/auth.schema.js";
import * as ctrl from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.post("/register", validate(registerSchema), asyncHandler(ctrl.register));
r.post("/login", validate(loginSchema), asyncHandler(ctrl.login));
r.post("/logout", asyncHandler(ctrl.logout));
r.get("/me", requireAuth, asyncHandler(ctrl.me));
export default r;
