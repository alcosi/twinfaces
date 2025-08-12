import { redirect } from "next/navigation";

import { EXPIRED_SESSION_TAG } from "@/shared/api";
import { isUnauthorizedError } from "@/shared/libs";

export function withRedirectOnUnauthorized<T>(
  fn: () => Promise<T>
): () => Promise<T> {
  return async function wrappedFn(): Promise<T> {
    try {
      return fn();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirect(`/?reason=${EXPIRED_SESSION_TAG}`);
      }
      throw error;
    }
  };
}
