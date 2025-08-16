import { Request, Response, NextFunction } from "express";
export function requireRole(role: "STUDENT"|"PROFESSOR"){
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role: string } | undefined;
    if(!user) return res.status(401).json({message:"Unauthorized"});
    if(user.role !== role) return res.status(403).json({message:"Forbidden"});
    next();
  };
}
