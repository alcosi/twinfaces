import { redirect } from "next/navigation";

import { EXPIRED_SESSION_TAG, Result } from "@/shared/api";
import { safe } from "@/shared/libs";

export function withRedirectOnUnauthorized<T>(
  fn: () => Promise<T>
): () => Promise<Result<T>> {
  return async function wrappedFn(): Promise<Result<T>> {
    const result = await safe(fn);

    if (!result.ok) {
      const error = result.error;

      console.error("FOOBAR error", { error });
      redirect(`/?reason=${EXPIRED_SESSION_TAG}`);

      // if (error.message.includes("NEXT_REDIRECT")) {
      //   redirect(`/?reason=${EXPIRED_SESSION_TAG}`);
      // }
      return { ok: false, error };
    } else {
      return { ok: true, data: result.data };
    }
  };
}
