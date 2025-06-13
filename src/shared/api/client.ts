import { env } from "next-runtime-env";
import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    console.log("Status in middleware:", response.status);

    if ([401, 403].includes(response.status)) {
      console.log("Would call logout here due to 401/403");
      // logout();
      throw new Error("UNAUTHORIZED");
    }

    return response;
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

TwinsAPI.use(unauthorizedMiddleware);
