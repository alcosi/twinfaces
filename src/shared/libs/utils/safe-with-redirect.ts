import { redirect } from "next/navigation";

import { safe } from "./safe";

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

// TODO: move to `shared/.../checkers/...
function isUnauthorizedError(error: unknown): boolean {
  // TODO: introduce a custom UnauthorizedError
  return error instanceof Error && error.message === "UNAUTHORIZED";
}

export function withRedirectOnUnauthorized<T>(
  fn: () => Promise<T>
): () => Promise<T> {
  return async function wrappedFn(): Promise<T> {
    const result = await safe(fn);

    if (!result.ok) {
      const error = result.error;

      if (isUnauthorizedError(error)) {
        if (typeof window === "undefined") throw error;

        redirect("/");
      }

      throw error;
    }

    return result.data;
  };
}
