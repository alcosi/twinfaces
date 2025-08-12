import { Middleware } from "openapi-fetch";

import { EXPIRED_SESSION_TAG } from "@/shared/api";
import { isBrowserRuntime } from "@/shared/libs";

export const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (isBrowserRuntime() && response.status === 401) {
      window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
    }

    return response;
  },
};
