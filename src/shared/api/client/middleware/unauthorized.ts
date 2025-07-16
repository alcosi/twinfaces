import { Middleware } from "openapi-fetch";

import { isBrowserRuntime, isUnauthorizedError } from "@/shared/libs";

import { EXPIRED_SESSION_TAG } from "../client";

export const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (isUnauthorizedError(response) && isBrowserRuntime()) {
      window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
    }

    return response;
  },
};
