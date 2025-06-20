import { redirect } from "next/navigation";

import { isUnauthorizedError } from "@/shared/api";
import { safe } from "@/shared/libs";

export function withRedirectOnUnauthorized<T>(
  fn: () => Promise<T>
): () => Promise<T> {
  return async function wrappedFn(): Promise<T> {
    const result = await safe(fn);

    if (!result.ok) {
      const error = result.error;

      if (isUnauthorizedError(error)) {
        if (typeof window === "undefined") throw error;

        redirect("/?reason=session_expired");
      }

      throw error;
    }

    return result.data;
  };
}
