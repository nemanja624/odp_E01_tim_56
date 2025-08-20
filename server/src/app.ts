import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { config } from './config.js';
import routes from './routes/index.js';
import fs from 'fs';

const app = express();
app.use(cors({
  origin: config.clientOrigin,
  credentials: true
}));

function ensureUploadDirs() {
  const dirs = [
    path.join(process.cwd(), 'src/uploads/images'),
    path.join(process.cwd(), 'src/uploads/materials'),
  ];
  for (const p of dirs) {
    fs.mkdirSync(p, { recursive: true });
  }
}
ensureUploadDirs();

app.use(express.json());
app.use(cookieParser());
app.use('/uploads/images', express.static(path.join(process.cwd(),'src/uploads/images')));
app.use('/uploads/materials', express.static(path.join(process.cwd(),'src/uploads/materials')));
app.use('/api', routes);
app.get('/', (_req, res)=> res.json({ ok: true }));
export default app;
