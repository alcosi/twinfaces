import { redirect } from "next/navigation";

import { EXPIRED_SESSION_TAG } from "@/shared/api";
import { isUnauthorizedError, safe } from "@/shared/libs";

export function withRedirectOnUnauthorized<T>(
  fn: () => Promise<T>
): () => Promise<T> {
  return async function wrappedFn(): Promise<T> {
    const result = await safe(fn);

    if (!result.ok) {
      const error = result.error;

      if (isUnauthorizedError(error)) {
        redirect(`/?reason=${EXPIRED_SESSION_TAG}`);
      }

      throw error;
    }

    return result.data;
  };
}
