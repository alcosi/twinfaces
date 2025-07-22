import { env } from "next-runtime-env";
import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

import { AuthUserService } from "./auth-user-service";

const IGNORED_PATHS = [
  "/public/domain/search/v1",
  "/auth/config/v1",
  "/auth/login/v1",
  "/private/domain/user/v1",
  "/auth/signup_by_email/initiate/v1",
  "/auth/signup_by_email/confirm/v1",
  "/auth/refresh/v2",
];

const refreshTokenMiddleware: Middleware = {
  async onResponse({ response, request }) {
    const url = new URL(response.url);
    if (IGNORED_PATHS.includes(url.pathname)) return response;
    if (response.status !== 401) return response;

    console.log("[Middleware] 401 detected — trying refresh...");

    let AuthToken: string | undefined;
    let RefreshToken: string | undefined;
    let DomainId: string | undefined;

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = cookies();
      AuthToken = cookieStore.get("authToken")?.value;
      RefreshToken = cookieStore.get("refreshToken")?.value;
      DomainId = cookieStore.get("domainId")?.value;
    } else {
      const oldUser = JSON.parse(localStorage.getItem("auth-user") || "{}");
      AuthToken = oldUser.authToken;
      RefreshToken = oldUser.refreshToken;
      DomainId = oldUser.domainId;
    }

    if (!RefreshToken || !DomainId) {
      console.warn("[Middleware] Missing refreshToken/domainId");
      return response;
    }

    const refreshed = await TwinsAPI.POST("/auth/refresh/v2", {
      body: { refreshToken: RefreshToken },
      params: {
        header: { AuthToken: AuthToken ?? "", DomainId, Channel: "WEB" },
      },
    });

    console.log("[Middleware] Refresh result:", refreshed);

    if (refreshed.error || !refreshed.data?.authData?.auth_token) {
      console.warn("[Middleware] Refresh failed, forcing logout");
      return response;
    }

    if (typeof window !== "undefined") {
      const newAuthData = refreshed.data.authData;
      document.cookie = `authToken=${newAuthData.auth_token}; path=/`;
      document.cookie = `refreshToken=${newAuthData.refresh_token}; path=/`;
      document.cookie = `domainId=${DomainId}; path=/`;

      const oldUser = JSON.parse(localStorage.getItem("auth-user") || "{}");
      const newUser = {
        ...oldUser,
        authToken: newAuthData.auth_token,
        refreshToken: newAuthData.refresh_token,
        domainId: DomainId,
      };
      localStorage.setItem("auth-user", JSON.stringify(newUser));
      AuthUserService.update(newUser);
    }

    const newHeaders = new Headers(request.headers);
    newHeaders.set("AuthToken", refreshed.data.authData.auth_token);
    newHeaders.set(
      "cookie",
      `authToken=${refreshed.data.authData.auth_token}; refreshToken=${refreshed.data.authData.refresh_token}; domainId=${DomainId}`
    );

    return fetch(request.url, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      credentials: "include",
    });
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

TwinsAPI.use(refreshTokenMiddleware);