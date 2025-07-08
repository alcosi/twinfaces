import createClient from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

import { errorMiddleware } from "./middleware/error";
import { unauthorizedMiddleware } from "./middleware/unauthorized";

export const EXPIRED_SESSION_TAG = "session_expired";

export const TwinsAPI = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_TWINS_API_URL,
});

// NOTE: order matters: normalize errors first, then handle 401s
TwinsAPI.use(errorMiddleware);
TwinsAPI.use(unauthorizedMiddleware);
