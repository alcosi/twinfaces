import { ApiErrorResponse, Result } from "@/shared/api";
import { isApiErrorResponse } from "@/shared/api/utils";

import { isErrorInstance } from "../types";

/**
 * Converts an unknown error into a standardized `Result` type to ensure consistent and transparent error handling,
 * while working around Next.js’s tendency to mask detailed error information when errors are thrown in server components,
 * API routes, or middleware.
 *
 * Next.js, especially in its App Router (and sometimes Pages Router), may obscure important error details—
 * replacing the actual error object with a generic digest or simplified message in production. This behavior makes it
 * difficult to access meaningful information such as HTTP status codes, backend error messages, or validation details.
 *
 * To avoid this issue, instead of throwing the error (which would be masked), this function:
 *
 * 1. Checks if the provided `error` is a recognized `Error` instance.
 * 2. If the error has a `cause` that matches the `ApiErrorResponse` shape, it returns this structured cause.
 * 3. Otherwise, it falls back to returning the basic `error.message`.
 * 4. If the input isn't even an `Error`, it serializes the unknown object for debugging purposes.
 *
 * This approach allows your application to surface meaningful and actionable error feedback to the user
 * or client-side components, without being blocked by Next.js's error serialization mechanisms.
 *
 * For more context on this issue, see:
 * - Next.js error masking explanation: https://nextjs.org/docs/app/api-reference/file-conventions/error#error
 * - Related discussion on StackOverflow: https://stackoverflow.com/questions/76305664/next-js-error-in-production-mode-digest-1782794309
 *
 * @param error The unknown error to handle.
 * @returns A `Result` object with `ok: false` and an appropriate error payload.
 */
export function errorToResult(
  error: unknown
): Result<never, ApiErrorResponse | string> {
  if (!isErrorInstance(error)) {
    return { ok: false, error: `Unrecognized error: ${JSON.stringify(error)}` };
  }

  const apiError = error.cause;

  if (isApiErrorResponse(apiError)) {
    return { ok: false, error: apiError };
  }

  return { ok: false, error: error.message };
}
