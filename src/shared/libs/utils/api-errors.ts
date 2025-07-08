import { ApiErrorResponse, Result } from "@/shared/api";
import { isApiErrorResponse } from "@/shared/api/utils";

import { isErrorInstance } from "../types";

// TODO: @Bulrock
// Please add comment here describing the purpose of this function and how it arrived from next.js specificity masking
// Please refactor the function if you find it neccessary
export function errorToResult(
  error: unknown
): Result<never, ApiErrorResponse | string> {
  if (!isErrorInstance(error)) {
    return { ok: false, error: `Unrecognized error: ${JSON.stringify(error)}` };
  }

  if (isApiErrorResponse(error.cause)) {
    return { ok: false, error: error.cause };
  }

  return { ok: false, error: error.message };
}
