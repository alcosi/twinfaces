import { refreshAuthTokenAction } from "../../../../../entities/user/server";

type RefreshData = {
  auth_token: string;
  refresh_token: string;
  auth_token_expires_at: string;
};

export const IGNORED_PATHS = ["/auth/refresh/v2"];

export function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function setAuthCookies(data: RefreshData) {
  document.cookie = `authToken=${data.auth_token}; path=/`;
  document.cookie = `refreshToken=${data.refresh_token}; path=/`;
  document.cookie = `authTokenExpiresAt=${data.auth_token_expires_at}; path=/`;
}

export async function getFreshToken(): Promise<string | null> {
  const authToken = getCookie("authToken");
  const refreshToken = getCookie("refreshToken");
  const domainId = getCookie("domainId");

  if (!authToken || !refreshToken || !domainId) return null;

  try {
    const res = await refreshAuthTokenAction(authToken, refreshToken, domainId);
    if (!res.ok) return null;

    const authData = res.data.authData as RefreshData;
    setAuthCookies(authData);

    return authData.auth_token;
  } catch (e) {
    console.error("[unauthorizedMiddleware] refresh failed", e);
    return null;
  }
}
