import { Middleware } from "openapi-fetch";

import { EXPIRED_SESSION_TAG } from "@/shared/api";
import { isBrowserRuntime } from "@/shared/libs";

import { IGNORED_PATHS, getCookie, getFreshToken } from "./utils";

let refreshingPromise: Promise<string | null> | null = null;

export const unauthorizedMiddleware: Middleware = {
  async onRequest({ request }) {
    if (!isBrowserRuntime()) return request;

    const authToken = getCookie("authToken");
    const domainId = getCookie("domainId");

    if (authToken) request.headers.set("AuthToken", authToken);
    if (domainId) request.headers.set("DomainId", domainId);

    return request;
  },

  async onResponse({ request, response }) {
    if (!isBrowserRuntime()) return response;

    const url = new URL(request.url);
    if (IGNORED_PATHS.includes(url.pathname) || response.status !== 401)
      return response;

    if (!refreshingPromise)
      refreshingPromise = getFreshToken().finally(
        () => (refreshingPromise = null)
      );
    const newToken = await refreshingPromise;

    if (newToken) {
      const domainId = getCookie("domainId");
      if (domainId) request.headers.set("DomainId", domainId);
      request.headers.set("AuthToken", newToken);

      return fetch(request.url, {
        headers: request.headers,
      });
    }

    window.location.href = `/?reason=${EXPIRED_SESSION_TAG}`;
    return new Response(null, { status: 401 });
  },
};
