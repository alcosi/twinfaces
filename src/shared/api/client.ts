import { env } from "next-runtime-env";
import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

import { isBrowserRuntime, isUnauthorizedError } from "../libs";
import { isApiErrorResponse } from "./utils";

export const EXPIRED_SESSION_TAG = "session_expired";

/**
 * Coerces an arbitrary value into a real JS Error.
 *
 * 1) If it matches our API’s { status, msg, statusDetails } shape,
 *    build an Error with message = “msg: statusDetails” and attach `cause`: { status, msg, statusDetails }.
 * 2) If it’s already an Error instance, return it unchanged.
 * 3) Otherwise (strings, numbers, plain objects, etc.), stringify it.
 */
export function toError(err: unknown): Error {
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

// 1) Error‐normalization middleware
const errorMiddleware: Middleware = {
  // Runs on *all* responses
  async onResponse({ response }) {
    if (!response.ok) {
      let payload: unknown;

      // Try to parse JSON body
      try {
        payload = await response.json();
      } catch {
        payload = response.statusText || `HTTP ${response.status}`;
      }

      // Throw as a real Error instance
      throw toError(payload);
    }

    return response;
  },
};

const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (isUnauthorizedError(response) && isBrowserRuntime()) {
      window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
    }

    return response;
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

// order matters: normalize errors first, then handle 401s
TwinsAPI.use(errorMiddleware);
TwinsAPI.use(unauthorizedMiddleware);
