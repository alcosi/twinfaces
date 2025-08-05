import { redirect } from "next/navigation";
import { Middleware } from "openapi-fetch";

import { isUnauthorizedError } from "@/shared/libs";

import { EXPIRED_SESSION_TAG } from "../client";

export const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (isUnauthorizedError(response)) {
      redirect(`/?reason=${EXPIRED_SESSION_TAG}`);
    }

    return response;
  },
};
