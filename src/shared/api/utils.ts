import {
  ERROR_RESPONSE_MESSAGE_VALUE,
  isNumber,
  isObject,
  isString,
} from "../libs";
import { isErrorInstance } from "../libs";
import { ApiErrorResponse } from "./types";

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isObject<Partial<ApiErrorResponse>>(value) &&
    isNumber(value.status) &&
    isString(value.msg) &&
    value.msg === ERROR_RESPONSE_MESSAGE_VALUE &&
    isString(value.statusDetails)
  );
}

export function getErrorMessage({
  error,
  fallback = "An unknown error occurred",
}: {
  error: unknown;
  fallback?: string;
}): string {
  if (isErrorInstance(error)) {
    const cause = (error as Error & { cause?: unknown }).cause;

    if (isApiErrorResponse(cause) && isString(cause.statusDetails)) {
      return cause.statusDetails;
    }

    return error.message || fallback;
  }

  if (isString(error)) {
    return error;
  }

  return fallback;
}

export function getError(error: unknown): ApiErrorResponse | Error {
  if (isErrorInstance(error)) {
    const err = error as Error & { cause?: unknown };
    if (isApiErrorResponse(err.cause)) return err;
    return error;
  }

  return new Error("Unknown error");
}
