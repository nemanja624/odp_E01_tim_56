import { Router } from 'express';
import { list } from '../controllers/courses.controller.js';
const r = Router();
r.get('/', list);
export default r;
