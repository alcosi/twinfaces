import { env } from "next-runtime-env";
import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    if ([401].includes(response.status)) {
      if (typeof window === "undefined") {
        throw new Error("UNAUTHORIZED");
      } else {
        window.location.href = "/";
      }
    }

    return response;
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

TwinsAPI.use(unauthorizedMiddleware);
