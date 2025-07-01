import { ApiErrorResponse } from "@/shared/api";
import { isApiErrorResponse } from "@/shared/api/utils";

/**
 * Prints an error to the console and returns the error if: `error instanceof Error && isApiErrorResponse(error.cause)`.
 *
 * We return the error.cause: `{ status, msg, statusDetails }: ApiErrorResponse` so it can be displayed to the user.
 *
 * Throwing it would cause Next.js to mask the details, leaving only the `error.message` available
 */
export function printAndReturnApiErrorResponse({
  error,
  requestName,
}: {
  error: unknown;
  requestName: string;
}): ApiErrorResponse | undefined {
  if (error instanceof Error && isApiErrorResponse(error.cause)) {
    console.error(`
         ${requestName} request failed:
         ${error};

         cause: {
           msg: ${error.cause?.msg};
           status: ${error.cause?.status};
           statusDetails: ${error.cause?.statusDetails};
         }
       `);
    return error.cause;
  }

  console.error(`
      ${requestName} request failed:
      ${error}
    `);

  return;
}
