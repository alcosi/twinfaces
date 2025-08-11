import { redirect } from "next/navigation";
import { Middleware } from "openapi-fetch";

import { EXPIRED_SESSION_TAG } from "@/shared/api";
import {
  isBrowserRuntime,
  isServerRuntime,
  isUnauthorizedError,
} from "@/shared/libs";

export const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (isUnauthorizedError(response) && !response.url.includes("auth/login")) {
      if (isBrowserRuntime()) {
        window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
      }
      // if (isServerRuntime()) {
      //   redirect(`/?reason=${EXPIRED_SESSION_TAG}`);
      // }
    }

    return response;
  },
};
