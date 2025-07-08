import { Result } from "@/shared/api";

export async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safe] Caught error:", error);
    return { ok: false, error };
  }
}
