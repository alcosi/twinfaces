import { NextRequest, NextResponse } from "next/server";

import { isDev, isPopulatedArray, isTruthy } from "./shared/libs";

async function fetchDomainByKey(key: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TWINS_API_URL}/public/domain_by_key/${key}/v1?showDomainMode=DETAILED`
  );

  const body = await response.json();
  return body.domain;
}

const SUBDOMAIN_DEPTH = isDev ? 2 : 3;

// NOTE: Middleware Function
export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const host = req.headers.get("host");

  if (isTruthy(host)) {
    const subdomains = host.split(".");
    if (
      isPopulatedArray<string>(subdomains) &&
      subdomains.length === SUBDOMAIN_DEPTH
    ) {
      const domainConfig = await fetchDomainByKey(subdomains[0]);
      if (domainConfig) {
        response.headers.set("X-Domain-Config", JSON.stringify(domainConfig));
      }
    }
  }

  return response;
}

// NOTE: Middleware Configuration
export const config = {
  matcher: "/:path*",
};
