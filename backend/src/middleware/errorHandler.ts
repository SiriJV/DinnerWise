import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const buildErrorResponse = (error: ApiError) => {
  const payload: {
    success: false;
    error: { code: string; message: string; details?: Record<string, unknown> };
  } = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };

  if (error.details && Object.keys(error.details).length > 0) {
    payload.error.details = error.details;
  }

  return payload;
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(buildErrorResponse(err));
  }

  if (env.node.isDev) {
    console.error('[ERROR] Unhandled error:', err);
  } else {
    console.error('[ERROR] Unhandled error');
  }

  const fallback = ApiError.internal();
  return res.status(fallback.statusCode).json(buildErrorResponse(fallback));
};