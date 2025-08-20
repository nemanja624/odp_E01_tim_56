import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export const validate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    next();
  } catch (e: any) {
    return res.status(400).json({ message: 'Validation error', issues: e.issues });
  }
};
