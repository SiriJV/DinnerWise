export type ApiErrorDetails = Record<string, unknown>;

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: ApiErrorDetails;

  constructor(statusCode: number, code: string, message: string, details?: ApiErrorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: ApiErrorDetails): ApiError {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static unauthorized(message = 'Inte inloggad', details?: ApiErrorDetails): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message, details);
  }

  static forbidden(message = 'Du har inte behörighet', details?: ApiErrorDetails): ApiError {
    return new ApiError(403, 'FORBIDDEN', message, details);
  }

  static notFound(message: string, details?: ApiErrorDetails): ApiError {
    return new ApiError(404, 'NOT_FOUND', message, details);
  }

  static conflict(message: string, details?: ApiErrorDetails): ApiError {
    return new ApiError(409, 'CONFLICT', message, details);
  }

  static serviceUnavailable(
    message = 'Tjänsten är inte tillgänglig',
    details?: ApiErrorDetails
  ): ApiError {
    return new ApiError(503, 'SERVICE_UNAVAILABLE', message, details);
  }

  static internal(message = 'Internt serverfel', details?: ApiErrorDetails): ApiError {
    return new ApiError(500, 'INTERNAL_SERVER_ERROR', message, details);
  }
}