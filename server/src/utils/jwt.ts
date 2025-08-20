import jwt from 'jsonwebtoken';
import { config } from '../config.js';
export type JwtPayload = { id: number, role: 'PROFESSOR'|'STUDENT' };
export const signJwt = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
export const verifyJwt = (token: string) =>
  jwt.verify(token, config.jwtSecret) as JwtPayload;
