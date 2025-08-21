import { Result } from "@/shared/api";

import { isErrorInstance } from "../types";

export async function safe<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safe] Caught error:", error);

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return {
      ok: false,
      error: isErrorInstance(error) ? error : new Error("Unknown Error"),
    };
  }
}
