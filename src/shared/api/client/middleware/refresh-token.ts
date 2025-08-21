import { Middleware } from "openapi-fetch";

import { isServerRuntime } from "@/shared/libs";

import { IGNORED_PATHS, getCookie, getFreshToken } from "./utils";

export function refreshTokenMiddleware(treshholdMinutes = 10): Middleware {
  let refreshingPromise: Promise<string | null> | null = null;

  return {
    async onRequest({ request }) {
      const url = new URL(request.url);
      if (IGNORED_PATHS.includes(url.pathname)) return request;

      if (isServerRuntime()) return request;

      let authToken = getCookie("authToken");
      const refreshToken = getCookie("refreshToken");
      const authTokenExpiresAt = getCookie("authTokenExpiresAt");
      const domainId = getCookie("domainId");

      if (refreshToken && authTokenExpiresAt && domainId) {
        try {
          const expiresAt = new Date(decodeURIComponent(authTokenExpiresAt));
          const diffMinutes = (expiresAt.getTime() - Date.now()) / 1000 / 60;

          if (diffMinutes <= treshholdMinutes) {
            if (!refreshingPromise) {
              refreshingPromise = getFreshToken().finally(
                () => (refreshingPromise = null)
              );
            }

            await refreshingPromise;
            authToken = getCookie("authToken");
          }
        } catch (error) {
          console.error("refreshTokenMiddleware error", error);
        }
      }

      if (authToken) request.headers.set("AuthToken", authToken);
      if (domainId) request.headers.set("DomainId", domainId);

      return request;
    },
  };
}
