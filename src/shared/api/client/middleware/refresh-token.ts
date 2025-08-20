import { Middleware } from "openapi-fetch";

import { isServerRuntime } from "@/shared/libs";

import { refreshAuthTokenAction } from "../../../../entities/user/server";

type RefreshData = {
  auth_token: string;
  refresh_token: string;
  auth_token_expires_at: string;
};

function getClientCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

const IGNORED_PATHS = ["/auth/refresh/v2"];

export function refreshTokenMiddleware(treshholdMinutes = 10): Middleware {
  let refreshingPromise: Promise<void> | null = null;

  return {
    async onRequest({ request }) {
      const url = new URL(request.url);
      if (IGNORED_PATHS.includes(url.pathname)) return request;

      if (isServerRuntime()) return request;

      let authToken = getClientCookie("authToken");
      const refreshToken = getClientCookie("refreshToken");
      const authTokenExpiresAt = getClientCookie("authTokenExpiresAt");
      const domainId = getClientCookie("domainId");

      if (authToken && refreshToken && authTokenExpiresAt && domainId) {
        try {
          const expiresAt = new Date(decodeURIComponent(authTokenExpiresAt));
          const diffMinutes =
            (expiresAt.getTime() - new Date().getTime()) / 1000 / 60;

          if (diffMinutes <= treshholdMinutes) {
            if (!refreshingPromise) {
              refreshingPromise = (async () => {
                const result = await refreshAuthTokenAction(
                  authToken!,
                  refreshToken!,
                  domainId!
                );

                if (result.ok) {
                  const {
                    auth_token: newAuthToken,
                    refresh_token: newRefreshToken,
                    auth_token_expires_at: newAuthTokenExpiresAt,
                  } = result.data.authData as RefreshData;

                  document.cookie = `authToken=${newAuthToken}; path=/`;
                  document.cookie = `refreshToken=${newRefreshToken}; path=/`;
                  document.cookie = `authTokenExpiresAt=${newAuthTokenExpiresAt}; path=/`;
                }
              })().finally(() => {
                refreshingPromise = null;
              });
            }

            await refreshingPromise;
            authToken = getClientCookie("authToken");
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
