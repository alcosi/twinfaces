import { Middleware } from "openapi-fetch";

import { isApiErrorResponse } from "../../utils";

// NOTE: Error‐normalization middleware
export const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        payload = response.statusText || `HTTP ${response.status}`;
      }

      throw toError(payload);
    }

    return response;
  },
};

/**
 * NOTE: Coerces an arbitrary value into a real JS Error.
 *
 * 1) If it matches our API’s { status, msg, statusDetails } shape,
 *    build an Error with message = “msg: statusDetails” and attach `cause`: { status, msg, statusDetails }.
 * 2) If it’s already an Error instance, return it unchanged.
 * 3) Otherwise (strings, numbers, plain objects, etc.), stringify it.
 */
function toError(err: unknown): Error {
  // 1) API‐shape error
  if (isApiErrorResponse(err)) {
    const error = new Error(err.statusDetails, { cause: err });

    return error;
  }

  // 2) Already a native Error
  if (err instanceof Error) {
    return err;
  }

  // 3) Fallback: stringify anything else
  const message = typeof err === "string" ? err : JSON.stringify(err);
  return new Error(message);
}
