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
  // TODO: Replace with a custom `UnauthorizedError` class for more robust handling.
  return error instanceof UnauthorizedError;
  // return error instanceof Response && error.status === 401;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

export function isErrorInstance(error: unknown): error is Error {
  return error instanceof Error;
}
