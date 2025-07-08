import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

import { isBrowserRuntime, isUnauthorizedError } from "../libs";

export const EXPIRED_SESSION_TAG = "session_expired";

const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (isUnauthorizedError(response) && isBrowserRuntime()) {
      window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
    }

    return response;
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_TWINS_API_URL,
});

TwinsAPI.use(unauthorizedMiddleware);
