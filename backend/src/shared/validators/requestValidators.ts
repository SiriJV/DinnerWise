import type { RequestHandler } from 'express';
import { ApiError } from '../errors/ApiError.js';

type ParamStore = Record<string, number>;

export const requirePositiveIntParam = (
  paramName: string,
  message?: string
): RequestHandler => {
  return (req, res, next) => {
    const rawValue = req.params[paramName];
    const value = Number(rawValue);

    if (!Number.isInteger(value) || value <= 0) {
      return next(ApiError.badRequest(message ?? `Ogiltigt ${paramName}-ID`, { [paramName]: rawValue }));
    }

    const params: ParamStore = res.locals.params ?? {};
    params[paramName] = value;
    res.locals.params = params;

    return next();
  };
};