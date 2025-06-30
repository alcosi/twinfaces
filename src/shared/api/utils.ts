import { isNumber, isObject, isString } from "../libs";
import { ApiErrorResponse } from "./types";

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isObject<Partial<ApiErrorResponse>>(value) &&
    isNumber(value.status) &&
    isString(value.msg) &&
    value.msg === "error" &&
    isString(value.statusDetails)
  );
}
