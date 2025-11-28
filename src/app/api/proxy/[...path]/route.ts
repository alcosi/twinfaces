import { env } from "next-runtime-env";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (
  process.env.TWINS_API_URL ||
  env("NEXT_PUBLIC_TWINS_API_URL") ||
  ""
).replace(/\/+$/, "");

const REFRESH_PATH = (
  process.env.TWINS_REFRESH_PATH || "/auth/refresh/v2"
).replace(/^\/?/, "/");

type Tokens = {
  accessToken: string;
  refreshToken?: string;
  authTokenExpiresAt?: string | number;
};

type CacheEntry<T> = { value: T; expiresAt: number };
const resolvedRefreshes = new Map<string, CacheEntry<Tokens>>();
const RESOLVED_TTL_MS = 20_000;

function putResolved(oldRefresh: string, tokens: Tokens) {
  resolvedRefreshes.set(oldRefresh, {
    value: tokens,
    expiresAt: Date.now() + RESOLVED_TTL_MS,
  });
}

function getResolved(oldRefresh: string): Tokens | null {
  const e = resolvedRefreshes.get(oldRefresh);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    resolvedRefreshes.delete(oldRefresh);
    return null;
  }
  return e.value;
}

const inflightRefreshes = new Map<string, Promise<Tokens | null>>();

function sanitizeHeaders(req: NextRequest, withAuth?: string) {
  const h = new Headers(req.headers);

  const PUBLIC_URL_EXCLUDE_MAP = [
    "/public/",
    "/auth/login/v1",
    "/private/domain/user/search/v1",
  ] as const;

  const isPublicEndpoint = PUBLIC_URL_EXCLUDE_MAP.some((item) =>
    req.nextUrl.pathname.includes(item)
  );

  h.delete("host");
  h.delete("content-length");

  for (const [k] of h) {
    const kl = k.toLowerCase();
    if (kl === "accept-encoding") h.delete(k);
    if (kl === "authorization") {
      if (isPublicEndpoint) continue;
      h.delete(k);
    }
  }
  h.set("accept-encoding", "identity");

  if (withAuth) {
    h.set("Authorization", `Bearer ${withAuth}`);
    h.set("AuthToken", withAuth);
  }

  if (isPublicEndpoint) {
    h.delete("transfer-encoding");
  }

  const rawDid = h.get("DomainId") ?? h.get("domainid");
  const needsFix =
    !rawDid ||
    rawDid === "undefined" ||
    rawDid === "null" ||
    rawDid.trim() === "";
  if (needsFix) {
    h.delete("DomainId");
    h.delete("domainid");
    const did = req.cookies.get("domainId")?.value;
    if (did) h.set("DomainId", did);
  }
  if (!h.has("Channel") && !h.has("channel")) h.set("Channel", "WEB");

  return h;
}

async function callBackend(
  req: NextRequest,
  access?: string,
  bodyBuf?: ArrayBuffer
) {
  const rel = req.nextUrl.pathname.replace(/^\/api\/proxy\//, "");
  const target = `${API_BASE}/${rel}${req.nextUrl.search}`;

  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers: sanitizeHeaders(req, access),
    cache: "no-store",
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = bodyBuf ? bodyBuf : undefined;
    init.duplex = "half";
  }

  try {
    const upstream = await fetch(target, init);
    return { upstream, target };
  } catch (e) {
    return { upstream: null as any, target, error: e as Error };
  }
}

function normalizeTokensFromJson(data: any): Tokens | null {
  const auth = data?.authData ?? data;
  const at = auth?.auth_token ?? auth?.accessToken ?? null;
  if (!at) return null;
  return {
    accessToken: at,
    refreshToken: auth?.refresh_token ?? auth?.refreshToken,
    authTokenExpiresAt: auth?.auth_token_expires_at ?? auth?.authTokenExpiresAt,
  };
}

async function refreshTokens(req: NextRequest, refreshToken?: string) {
  if (!refreshToken) return null;

  const cached = getResolved(refreshToken);
  if (cached) return cached;

  const url = `${API_BASE}${REFRESH_PATH}`;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    Channel: "WEB",
  };
  const did = req.cookies.get("domainId")?.value;
  if (did) headers["DomainId"] = did;

  const r = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!r.ok) {
    const again = getResolved(refreshToken);
    return again ?? null;
  }

  let data: any = null;
  try {
    data = await r.json();
  } catch {
    /* no-op */
  }

  const tokens = normalizeTokensFromJson(data);
  if (!tokens?.accessToken) return null;

  putResolved(refreshToken, tokens);
  return tokens;
}

async function getRefreshedTokens(req: NextRequest, refreshToken: string) {
  const inFlight = inflightRefreshes.get(refreshToken);
  if (inFlight) return inFlight;

  const p = (async () => {
    try {
      return await refreshTokens(req, refreshToken);
    } finally {
      inflightRefreshes.delete(refreshToken);
    }
  })();

  inflightRefreshes.set(refreshToken, p);
  return p;
}

function makeProxyResponse(
  upstream: Response,
  target: string,
  extra?: Record<string, string>
) {
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
  if (extra) for (const [k, v] of Object.entries(extra)) res.headers.set(k, v);
  return res;
}

async function handler(req: NextRequest) {
  const access = req.cookies.get("authToken")?.value;
  const refresh = req.cookies.get("refreshToken")?.value;
  const bodyBuf = !["GET", "HEAD"].includes(req.method)
    ? await req.arrayBuffer()
    : undefined;

  let { upstream, target } = await callBackend(req, access, bodyBuf);

  if (upstream?.status === 401 && refresh) {
    const renewed = await getRefreshedTokens(req, refresh);

    if (renewed?.accessToken) {
      ({ upstream, target } = await callBackend(
        req,
        renewed.accessToken,
        bodyBuf
      ));

      const res = makeProxyResponse(upstream, target, {
        "x-proxy-refresh": "success",
      });

      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      res.cookies.set("authToken", renewed.accessToken, cookieOpts);
      if (renewed.refreshToken)
        res.cookies.set("refreshToken", renewed.refreshToken, cookieOpts);
      if (renewed.authTokenExpiresAt)
        res.cookies.set(
          "authTokenExpiresAt",
          String(renewed.authTokenExpiresAt),
          cookieOpts
        );

      return res;
    }
  }

  const res = makeProxyResponse(upstream, target, {
    "x-proxy-did": req.cookies.get("domainId")?.value ?? "none",
    "x-proxy-refresh":
      upstream.status === 401
        ? refresh
          ? "failed-or-skip"
          : "no-refresh-token"
        : "n/a",
  });

  return res;
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
