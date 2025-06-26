import { ParsedError, Result } from "@/shared/api";
import { parseUnknownError } from "@/shared/libs";

export async function safe<T>(
  fn: () => Promise<T>
): Promise<Result<T, ParsedError>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safe] Caught error:", error);
    return { ok: false, error: parseUnknownError(error) };
  }
}
