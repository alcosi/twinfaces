import { Middleware } from "openapi-fetch";

import { EXPIRED_SESSION_TAG } from "@/shared/api";

export const unauthorizedMiddleware: Middleware = {
  async onResponse({ response, request }) {
    if (response.status === 401 && typeof window !== "undefined") {
      const u = new URL(request.url);
      if (!u.pathname.startsWith("/api/proxy")) {
        window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
      }
    }
    return response;
  },
};
