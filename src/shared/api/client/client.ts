import { env } from "next-runtime-env";
import createClient from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

import { errorMiddleware } from "./middleware/error";
import { tryToRefreshTokenMiddleware } from "./middleware/refresh-token";
import { unauthorizedMiddleware } from "./middleware/unauthorized";

export const EXPIRED_SESSION_TAG = "session_expired";

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

/*
 The order in which middleware are registered matters. 
 
 For requests, onRequest() will be called in the order registered.
 For responses, onResponse() will be called in reverse order. 
 
 That way the first middleware gets the first “dibs” on requests,
 and the final control over the end response.

 see: https://openapi-ts.dev/openapi-fetch/middleware-auth
*/
TwinsAPI.use(errorMiddleware); // normalize errors first, then handle 401s
TwinsAPI.use(tryToRefreshTokenMiddleware());
TwinsAPI.use(unauthorizedMiddleware);
