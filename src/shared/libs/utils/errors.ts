import { ParsedError } from "@/shared/api";

export function parseUnknownError(err: unknown): ParsedError {
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "msg" in err &&
    "statusDetails" in err
  ) {
    const e = err as Record<string, unknown>;

    if (
      typeof e.status === "number" &&
      typeof e.msg === "string" &&
      typeof e.statusDetails === "string"
    ) {
      return {
        status: e.status,
        msg: e.msg,
        statusDetails: e.statusDetails,
      };
    }
  }

  let status = 0;
  let msg = "error";
  let statusDetails = "An unknown error occurred";

  if (err instanceof Error) {
    statusDetails = err.message;
  } else if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;

    if (typeof e.message === "string") {
      statusDetails = e.message;
    }

    if (typeof e.status === "number") {
      status = e.status;
    }
  }

  return { status, msg, statusDetails };
}
