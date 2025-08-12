//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: Custom API Error Classes
// ──────────────────────────────────────────────────────────────────────────────
//
export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, details?: unknown) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.details = details;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(details?: unknown) {
    super(401, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(details?: unknown) {
    super(403, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(details?: unknown) {
    super(404, details);
  }
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: Error & Exception Guards
// ──────────────────────────────────────────────────────────────────────────────
//
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function isUnauthorizedError(
  error: unknown
): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

export function isForbiddenError(error: unknown): error is ForbiddenError {
  return error instanceof ForbiddenError;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

export function isErrorInstance(error: unknown): error is Error {
  return error instanceof Error;
}
