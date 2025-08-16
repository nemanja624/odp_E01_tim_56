export class AppError extends Error { constructor(public status: number, message: string){ super(message);} }
export const NotFound = (m="Not found") => new AppError(404, m);
export const BadRequest = (m="Bad request") => new AppError(400, m);
export const Forbidden = (m="Forbidden") => new AppError(403, m);
export const Unauthorized = (m="Unauthorized") => new AppError(401, m);
