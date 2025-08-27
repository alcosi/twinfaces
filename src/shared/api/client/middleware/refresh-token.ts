import { Middleware } from "openapi-fetch";

// import { isServerRuntime } from "@/shared/libs";

// import { IGNORED_PATHS, getCookie, getFreshToken } from "./utils";

const ms = 5 * 60_000;

export function tryToRefreshTokenMiddleware(thresholdMs?: number): Middleware {
  let refreshingPromise: Promise<string | null> | null = null;

  return {
    // async onRequest({ request }) {
    //   const url = new URL(request.url);
    //   if (IGNORED_PATHS.includes(url.pathname)) return request;

    //   if (isServerRuntime()) return request;

    //   let authToken = getCookie("authToken");
    //   const refreshToken = getCookie("refreshToken");
    //   const authTokenExpiresAt = getCookie("authTokenExpiresAt");
    //   const domainId = getCookie("domainId");

    //   if (refreshToken && authTokenExpiresAt && domainId) {
    //     try {
    //       const expiresAt = new Date(decodeURIComponent(authTokenExpiresAt));
    //       const diffMinutes = (expiresAt.getTime() - Date.now()) / 60_000;

    //       if (diffMinutes <= thresholdMs) {
    //         if (!refreshingPromise) {
    //           refreshingPromise = getFreshToken().finally(
    //             () => (refreshingPromise = null)
    //           );
    //         }

    //         await refreshingPromise;
    //         authToken = getCookie("authToken");
    //       }
    //     } catch (error) {
    //       console.error("refreshTokenMiddleware error", error);
    //     }
    //   }

    //   if (authToken) request.headers.set("AuthToken", authToken);
    //   if (domainId) request.headers.set("DomainId", domainId);

    //   return request;
    // },

    // add to returned middleware object
    async onResponse({ response, request }) {
      console.log(`foobar onResponse#${response.status}`, {
        response,
        request,
      });
      // if (response.status === 401 || response.status === 419) {
      //   if (!refreshingPromise) {
      //     refreshingPromise = getFreshToken().finally(
      //       () => (refreshingPromise = null)
      //     );
      //   }
      //   await refreshingPromise;
      //   const token = getCookie("authToken");
      //   if (token) {
      //     const headers = new Headers(request.headers);
      //     headers.set("AuthToken", token);
      //     const retried = new Request(request, { headers });
      //     return client.fetch(retried);
      //   }
      // }
      return response;
    },
  };
}
