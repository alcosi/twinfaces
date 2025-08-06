import { Result } from "@/shared/api";

export async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safe] Caught error:", error);

    let status: number | undefined;

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        status = parsed.status;
      } catch {}
    }

    return { ok: false, error: error as Error, status };
  }
}
