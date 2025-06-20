import { env } from "next-runtime-env";
import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/?reason=session_expired";
      }
    }

    return response;
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

TwinsAPI.use(unauthorizedMiddleware);
