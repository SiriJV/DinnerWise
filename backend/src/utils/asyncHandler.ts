import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <T = any>(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<T>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};