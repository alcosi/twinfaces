import { ApiErrorResponse } from "@/shared/api";
import { isApiErrorResponse } from "@/shared/api/utils";

import { isNumber, isObject, isString } from "../types";

export function parseUnknownError(error: unknown): ApiErrorResponse {
  const isErrorInstance = error instanceof Error;

  if (isErrorInstance && isApiErrorResponse(error.cause)) {
    return error.cause;
  }

  const fallback: ApiErrorResponse = {
    status: 0,
    msg: "error",
    statusDetails: "An unknown error occurred",
  };

  if (isErrorInstance) {
    fallback.statusDetails = error.message;
  } else if (isObject(error)) {
    const e = error as Record<string, unknown>;

    if (isString(e.message)) {
      fallback.statusDetails = e.message;
    }

    if (isNumber(e.status)) {
      fallback.status = e.status;
    }
  }

  return fallback;
}
