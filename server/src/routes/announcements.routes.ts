import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { announcementCreateSchema, announcementUpdateSchema, reactionSchema } from '../validators/announcement.js';
import * as Ctrl from '../controllers/announcements.controller.js';

const r = Router();
r.get('/course/:courseId', auth, Ctrl.list);
r.post('/course/:courseId', auth, requireRole('PROFESSOR'), Ctrl.uploadImage.single('image'), validate(announcementCreateSchema), Ctrl.create);
r.put('/:id', auth, requireRole('PROFESSOR'), validate(announcementUpdateSchema), Ctrl.update);
r.delete('/:id', auth, requireRole('PROFESSOR'), Ctrl.remove);
r.post('/:id/react', auth, validate(reactionSchema), Ctrl.react); // students & profs can react; adjust in client
export default r;
