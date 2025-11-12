import createClient from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

import { errorMiddleware } from "./middleware/error";
import { unauthorizedMiddleware } from "./middleware/unauthorized";

export const EXPIRED_SESSION_TAG = "session_expired";

export const TwinsAPI = createClient<paths>({ baseUrl: "/api/proxy" });

export function createTwinsClient(baseUrl: string, fetchImpl?: typeof fetch) {
  return createClient<paths>({ baseUrl, fetch: fetchImpl });
}

// NOTE: order matters: normalize errors first, then handle 401s
TwinsAPI.use(errorMiddleware);
TwinsAPI.use(unauthorizedMiddleware);
