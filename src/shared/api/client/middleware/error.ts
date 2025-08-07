import { Middleware } from "openapi-fetch";

import { ERROR_CODE_MAP, NotFoundError } from "@/shared/libs";

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
    switch (err.status) {
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
        return new NotFoundError(err);
      default:
        return new Error(err.statusDetails, { cause: err });
    }
  }

  // 2) Already a native Error
  if (err instanceof Error) {
    return err;
  }

  // 3) Fallback: stringify anything else
  const message = typeof err === "string" ? err : JSON.stringify(err);
  return new Error(message);
}
