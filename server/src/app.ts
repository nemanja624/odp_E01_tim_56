import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import announcementRoutes from "./routes/announcement.routes";
import materialRoutes from "./routes/material.routes";

const app = express();
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/static", express.static(path.join(process.cwd(), "server", "src", "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/materials", materialRoutes);

export default app;
