import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = (req.cookies?.token) || (req.headers.authorization?.split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyJwt(token);
    // @ts-ignore
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(role: 'PROFESSOR'|'STUDENT') {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user;
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
