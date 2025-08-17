import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import materialRoutes from "./routes/material.routes.js";

const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ⬇⬇⬇ prvo specijalni static za materijale (forsira download)
app.use(
  "/static/materials",
  express.static(path.join(process.cwd(), "src", "uploads", "materials"), {
    setHeaders(res) {
      res.setHeader("Content-Disposition", "attachment");
    },
  })
);

// ⬇⬇⬇ zatim opšti static (slike itd.)
app.use("/static", express.static(path.join(process.cwd(), "src", "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("API radi!"));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/materials", materialRoutes);

export default app;
