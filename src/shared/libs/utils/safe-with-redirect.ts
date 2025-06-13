import { redirect } from "next/navigation";

export async function safeWithRedirect<T>(
  fn: () => Promise<T>
): Promise<{ ok: true; data: T } | { ok: false; error: unknown }> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safeWithRedirect] Caught error:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      redirect("/");
    }

    return { ok: false, error };
  }
}
