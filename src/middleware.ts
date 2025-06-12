import { NextRequest, NextResponse } from "next/server";

import { fetchDomainByKey } from "@/entities/domain/api";
import { isDev, isPopulatedArray, isTruthy } from "@/shared/libs";

const SUBDOMAIN_DEPTH = isDev ? 2 : 3;
const FIXED_DOMAIN_KEY = process.env.FIXED_DOMAIN_KEY || null;

// NOTE: Middleware Function
export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const host = req.headers.get("host");

  let domainKey: string | null = null;

  if (FIXED_DOMAIN_KEY) {
    domainKey = FIXED_DOMAIN_KEY;
  } else if (isTruthy(host)) {
    const subdomains = host.split(".");
    if (
      isPopulatedArray<string>(subdomains) &&
      subdomains.length === SUBDOMAIN_DEPTH
    ) {
      domainKey = subdomains[0];
    }
  }

  if (domainKey) {
    const domainConfig = await fetchDomainByKey(domainKey);
    if (domainConfig) {
      response.headers.set("X-Domain-Config", JSON.stringify(domainConfig));
    }
  }

  return response;
}

// NOTE: Middleware Configuration
export const config = {
  matcher: "/:path*",
};
