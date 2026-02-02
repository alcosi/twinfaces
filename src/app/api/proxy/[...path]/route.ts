import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (
  process.env.TWINS_API_URL ||
  process.env.NEXT_PUBLIC_TWINS_API_URL ||
  ""
).replace(/\/+$/, "");

console.log("🔧 API_BASE =", API_BASE);

const REFRESH_PATH = (
  process.env.TWINS_REFRESH_PATH || "/auth/refresh/v2"
).replace(/^\/?/, "/");

console.log("🔧 REFRESH_PATH =", REFRESH_PATH);

type Tokens = {
  accessToken: string;
  refreshToken?: string;
  authTokenExpiresAt?: string | number;
};

type CacheEntry<T> = { value: T; expiresAt: number };
const resolvedRefreshes = new Map<string, CacheEntry<Tokens>>();
const inflight = new Map<string, Promise<Tokens | null>>();
const TTL = 20_000;

const PUBLIC_ENDPOINTS = ["/public/", "/auth/signup"] as const;

function isPublicEndpoint(path: string) {
  const result = PUBLIC_ENDPOINTS.some((p) => path.includes(p));
  console.log("🌐 isPublicEndpoint(", path, ") =", result);
  return result;
}

function putResolved(refresh: string, tokens: Tokens) {
  console.log("💾 putResolved refresh=", refresh, " tokens=", tokens);
  resolvedRefreshes.set(refresh, {
    value: tokens,
    expiresAt: Date.now() + TTL,
  });
}

function getResolved(refresh: string): Tokens | null {
  const v = resolvedRefreshes.get(refresh);
  console.log("📦 getResolved(", refresh, ") =", v);
  if (!v) return null;
  if (Date.now() > v.expiresAt) {
    console.log("⚠️ getResolved expired");
    resolvedRefreshes.delete(refresh);
    return null;
  }
  return v.value;
}

async function refreshTokens(req: NextRequest, refresh?: string) {
  console.log("🔄 refreshTokens START refresh=", refresh);
  if (!refresh) return null;

  const cached = getResolved(refresh);
  if (cached) {
    console.log("🔄 refreshTokens RETURN CACHED");
    return cached;
  }

  const infl = inflight.get(refresh);
  if (infl) {
    console.log("🔄 refreshTokens RETURN INFLIGHT");
    return infl;
  }

  const url = `${API_BASE}${REFRESH_PATH}`;
  console.log("🔄 refreshTokens URL =", url);

  const p = (async () => {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      Channel: "WEB",
    };

    const did = req.cookies.get("domainId")?.value;
    if (did) headers["DomainId"] = did;

    console.log("🔄 REFRESH POST headers=", headers);

    const r = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken: refresh }),
      cache: "no-store",
    });

    console.log("🔄 REFRESH response status =", r.status);

    if (!r.ok) return null;

    let data: any;
    try {
      data = await r.json();
    } catch (err) {
      console.log("❌ refreshTokens JSON parse failed", err);
      return null;
    }

    console.log("🔄 refreshTokens data =", data);

    const auth = data?.authData ?? data;
    const accessToken =
      auth?.auth_token || auth?.accessToken || data?.accessToken;

    console.log("🔄 refreshTokens accessToken =", accessToken);

    if (!accessToken) return null;

    const tokens: Tokens = {
      accessToken,
      refreshToken: auth?.refresh_token ?? auth?.refreshToken,
      authTokenExpiresAt:
        auth?.auth_token_expires_at ?? auth?.authTokenExpiresAt,
    };

    console.log("🔄 refreshTokens TOKENS RESOLVED =", tokens);

    putResolved(refresh, tokens);
    return tokens;
  })();

  inflight.set(refresh, p);
  p.finally(() => {
    console.log("🔄 refreshTokens inflight finished");
    inflight.delete(refresh);
  });

  return p;
}

function sanitizeHeaders(req: NextRequest, access?: string | null) {
  console.log("🧹 sanitizeHeaders START access=", access);

  const h = new Headers(req.headers);
  const path = req.nextUrl.pathname;

  const isPublic = isPublicEndpoint(path);

  console.log("🧹 sanitizeHeaders original headers =", Object.fromEntries(h));

  h.delete("host");
  h.delete("content-length");
  h.delete("accept-encoding");
  h.set("accept-encoding", "identity");

  h.delete("transfer-encoding");

  if (isPublic) {
    console.log("🧹 sanitizeHeaders PUBLIC endpoint — removing auth headers");

    [
      "authorization",
      "authtoken",
      "AuthToken",
      "DomainId",
      "domainid",
      "cookie",
      "Cookie",
    ].forEach((k) => h.delete(k));

    h.set("Channel", "WEB");

    console.log("🧹 sanitizeHeaders PUBLIC result =", Object.fromEntries(h));
    return h;
  }

  if (access) {
    h.set("Authorization", `Bearer ${access}`);
    h.set("AuthToken", access);
  }

  const rawDid = h.get("DomainId") ?? h.get("domainid");
  const needsFix =
    !rawDid || rawDid === "null" || rawDid === "undefined" || rawDid === "";

  console.log(
    "🧹 sanitizeHeaders DomainId raw =",
    rawDid,
    " needsFix=",
    needsFix
  );

  if (needsFix) {
    h.delete("DomainId");
    h.delete("domainid");
    const did = req.cookies.get("domainId")?.value;
    console.log("🧹 setting DomainId from cookie =", did);
    if (did) h.set("DomainId", did);
  }

  if (!h.has("Channel")) h.set("Channel", "WEB");

  console.log("🧹 sanitizeHeaders FINAL headers =", Object.fromEntries(h));

  return h;
}

async function callBackend(
  req: NextRequest,
  access?: string | null,
  bodyBuf?: ArrayBuffer
) {
  console.log("📡 callBackend START access=", access);

  const rel = req.nextUrl.pathname.replace(/^\/api\/proxy\//, "");
  const search = req.nextUrl.search;

  const target = `${API_BASE}/${rel}${search}`;

  console.log("📡 callBackend target =", target);

  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers: sanitizeHeaders(req, access),
    cache: "no-store",
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = bodyBuf;
    init.duplex = "half";
  }

  console.log("📡 callBackend init =", init);

  try {
    const upstream = await fetch(target, init);
    console.log("📡 callBackend response status =", upstream.status);
    return { upstream, target };
  } catch (e) {
    console.log("❌ callBackend ERROR =", e);
    return { upstream: null as any, target, error: e as Error };
  }
}

function makeProxyResponse(upstream: Response, target: string) {
  console.log("📦 makeProxyResponse status =", upstream.status);

  const headers = new Headers(upstream.headers);

  [
    "content-encoding",
    "content-length",
    "transfer-encoding",
    "connection",
    "keep-alive",
  ].forEach((h) => headers.delete(h));

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });

  res.headers.set("x-proxy-target", target);

  console.log(
    "📦 makeProxyResponse final headers =",
    Object.fromEntries(res.headers)
  );

  return res;
}

async function handler(req: NextRequest) {
  console.log("====== 🛰  PROXY REQUEST START ======");
  console.log("➡️ req.method =", req.method);
  console.log("➡️ req.url =", req.url);

  const isPublic = isPublicEndpoint(req.nextUrl.pathname);
  console.log("➡️ isPublic =", isPublic);

  const accessCookie = req.cookies.get("authToken")?.value ?? null;
  const refresh = req.cookies.get("refreshToken")?.value ?? null;

  console.log("🍪 accessCookie =", accessCookie);
  console.log("🍪 refreshCookie =", refresh);

  const bodyBuf = !["GET", "HEAD"].includes(req.method)
    ? await req.arrayBuffer()
    : undefined;

  let access = isPublic ? null : accessCookie;

  if (!isPublic && refresh) {
    const cached = getResolved(refresh);
    console.log("🔎 cached TOKEN =", cached);
    if (cached?.accessToken) access = cached.accessToken;
  }

  console.log("➡️ Using access token =", access);

  let { upstream, target } = await callBackend(req, access, bodyBuf);

  if (!isPublic && upstream?.status === 401 && refresh) {
    console.log("🔄 401 detected — trying refresh flow");

    const renewed = await refreshTokens(req, refresh);
    console.log("🔄 renewed =", renewed);

    if (renewed?.accessToken) {
      access = renewed.accessToken;

      ({ upstream, target } = await callBackend(req, access, bodyBuf));

      const res = makeProxyResponse(upstream, target);

      const opts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      console.log("🍪 Setting refreshed cookies");

      res.cookies.set("authToken", renewed.accessToken, opts);
      if (renewed.refreshToken)
        res.cookies.set("refreshToken", renewed.refreshToken, opts);

      if (renewed.authTokenExpiresAt)
        res.cookies.set(
          "authTokenExpiresAt",
          String(renewed.authTokenExpiresAt),
          opts
        );

      console.log("====== 🛰  PROXY REQUEST END (REFRESHED) ======");
      return res;
    }
  }

  console.log("====== 🛰  PROXY REQUEST END ======");
  return makeProxyResponse(upstream, target);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
