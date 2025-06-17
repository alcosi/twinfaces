import { env } from "next-runtime-env";
import { NextRequest, NextResponse } from "next/server";

import { fetchDomainByKey } from "@/entities/domain/api";
import { isDev, isFalsy, isTruthy, safe } from "@/shared/libs";

const SUBDOMAIN_DEPTH = isDev ? 2 : 3;
const RESPONSE_STATUSES_TO_SHOW_ERROR = [404, 500];

/**
 * Determines which domain key to use:
 * 1. If NEXT_PUBLIC_FIXED_DOMAIN_KEY is set, use that.
 * 2. Otherwise, extract the first subdomain when the host has the expected depth.
 */
function resolveDomainKey(host?: string): string | undefined {
  const fixed = env("NEXT_PUBLIC_FIXED_DOMAIN_KEY");
  if (fixed) return fixed;

  if (!host) return;
  const parts = host.split(".");
  return parts.length === SUBDOMAIN_DEPTH ? parts[0] : undefined;
}

// NOTE: Middleware Function
export async function middleware(req: NextRequest) {
  const response = NextResponse.next() as NextResponse & {
    error?: unknown;
  };
  const host = req.headers.get("host");
  const domainKey = resolveDomainKey(host || undefined);

  if (domainKey) {
    const result = await safe(() => fetchDomainByKey(domainKey));

    if (result.ok && isTruthy(result.data)) {
      response.headers.set("X-Domain-Config", JSON.stringify(result.data));
    }
  }

  const shouldShowMiddlewareError =
    !response.ok && RESPONSE_STATUSES_TO_SHOW_ERROR.includes(response.status);

  if (isDev) {
    const error = response.error;

    if (shouldShowMiddlewareError && isTruthy(error)) {
      response.cookies.set("middlewareError", JSON.stringify(error));
    }
    if (shouldShowMiddlewareError && isFalsy(error)) {
      response.cookies.set(
        "middlewareError",
        `Unexpected API error occurred at ${new Date().toISOString()}`
      );
    }
  }

  return response;
}

// NOTE: Middleware Configuration
export const config = {
  matcher: "/:path*",
};
