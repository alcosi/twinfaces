export function isUnauthorizedError(error: unknown): boolean {
  // TODO: introduce a custom UnauthorizedError
  return error instanceof Response && error.status === 401;
}
