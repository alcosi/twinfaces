export function parseUnknownError(err: unknown): {
  statusCode: number;
  statusDetails: string;
} {
  let statusCode = 0;
  let statusDetails = "An unknown error occurred";

  if (err instanceof Error) {
    statusDetails = err.message;
  } else if (typeof err === "object" && err !== null) {
    statusDetails =
      "message" in err ? String((err as any).message) : statusDetails;
    statusCode = "status" in err ? ((err as any).status ?? 0) : 0;
  }

  return { statusCode, statusDetails };
}
