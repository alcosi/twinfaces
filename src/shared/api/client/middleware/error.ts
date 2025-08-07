import { Middleware } from "openapi-fetch";

import {
  ERROR_CODE_MAP,
  ForbiddenError,
  HttpError,
  NotFoundError,
  UnauthorizedError,
} from "@/shared/libs";

import { isApiErrorResponse } from "../../utils";

// NOTE: Error‐normalization middleware
export const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      const payload = await response.json();

      throw toError({ httpStatus: response.status, payload });
    }

    return response;
  },
};

/**
 * Normalize any HTTP response payload into a concrete JS Error.
 *
 * Resolution order:
 * 1. HTTP‐level status codes:
 *    – 401 → UnauthorizedError
 *    – 403 → ForbiddenError
 *    – 404 → NotFoundError
 * 2. API‐level error shape (has `{ status, msg, statusDetails }`):
 *    – Certain codes (e.g. UUID_UNKNOWN, USER_UNKNOWN, etc.) → NotFoundError
 *    – All other API codes → HttpError
 * 3. If the payload is already an Error instance, return it unchanged.
 * 4. Fallback: stringify the payload and wrap it in HttpError.
 *
 * @param httpStatus HTTP status code from the response
 * @param payload    Parsed JSON body or raw error payload
 */

function toError({
  httpStatus,
  payload,
}: {
  httpStatus: number;
  payload: unknown;
}): Error {
  // 1) HTTP‐level
  switch (httpStatus) {
    case 401:
      return new UnauthorizedError({ httpStatus, payload });
    case 403:
      return new ForbiddenError({ httpStatus, payload });
    case 404:
      return new NotFoundError({ httpStatus, payload });
    // add more cases if you have 429/rate-limit, 500, etc.
  }

  // 2) API‐level
  if (isApiErrorResponse(payload)) {
    const apiErrorCode = payload.status;

    switch (apiErrorCode) {
      case ERROR_CODE_MAP.UUID_UNKNOWN:
      case ERROR_CODE_MAP.USER_UNKNOWN:
      case ERROR_CODE_MAP.USER_LOCALE_UNKNOWN:
      case ERROR_CODE_MAP.DOMAIN_UNKNOWN:
      case ERROR_CODE_MAP.DOMAIN_LOCALE_UNKNOWN:
      case ERROR_CODE_MAP.PERMISSION_ID_UNKNOWN:
      case ERROR_CODE_MAP.TWIN_CLASS_FIELD_KEY_UNKNOWN:
      case ERROR_CODE_MAP.TWIN_CLASS_ID_UNKNOWN:
      case ERROR_CODE_MAP.TWIN_CLASS_KEY_UNKNOWN:
      case ERROR_CODE_MAP.DATALIST_LIST_UNKNOWN:
      case ERROR_CODE_MAP.TWIN_ALIAS_UNKNOWN:
      case ERROR_CODE_MAP.TWIN_BASIC_FIELD_UNKNOWN:
      case ERROR_CODE_MAP.TWIN_SEARCH_ALIAS_UNKNOWN:
      case ERROR_CODE_MAP.USER_GROUP_UNKNOWN:
      case ERROR_CODE_MAP.BUSINESS_ACCOUNT_UNKNOWN:
        return new NotFoundError(payload);
    }

    return new HttpError(httpStatus, payload);
  }

  // 3) Native `Error`
  if (payload instanceof Error) {
    return payload;
  }

  // 4) Fallback: stringify anything else
  const message =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  return new HttpError(httpStatus, message);
}
