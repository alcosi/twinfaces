export async function safe<T>(
  fn: () => Promise<T>
): Promise<{ ok: true; data: T } | { ok: false; error: unknown }> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    console.warn("[safe] Caught error:", error);
    return { ok: false, error };
  }
}
