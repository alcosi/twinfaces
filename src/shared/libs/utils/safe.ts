import { Result } from "@/shared/api";

import { HttpError, NotFoundError } from "../types";

export async function safe<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safe] Caught error:", error);

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);

        switch (parsed.status) {
          case 404:
            return { ok: false, error: new NotFoundError(parsed) };
          default:
            return { ok: false, error: new HttpError(parsed.status, parsed) };
        }
      } catch {
        return { ok: false, error };
      }
    }

    return { ok: false, error: new Error("Unknown error") };
  }
}
