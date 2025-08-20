import { Request, Response } from 'express';
import * as Users from '../repositories/user.repo.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signJwt } from '../utils/jwt.js';

export async function register(req: Request, res: Response) {
  const { name, email, password, role, courseIds } = req.body;
  const exists = await Users.findByEmail(email);
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const hash = await hashPassword(password);
  const id = await Users.createUser(name,email,hash,role);
  await Users.upsertUserCourses(id, courseIds.slice(0,3));
  const token = signJwt({ id, role });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  const courses = await Users.getUserCourses(id);
  return res.json({ user: { id, name, email, role, courses }, token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signJwt({ id: user.id, role: user.role });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  const courses = await Users.getUserCourses(user.id);
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, courses }, token });
}

export async function me(req: Request, res: Response) {
  // @ts-ignore
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found'});
  const courses = await Users.getUserCourses(user.id);
  res.json({ user: { ...user, courses } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ ok: true });
}
