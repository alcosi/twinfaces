import { env } from "next-runtime-env";
import createClient, { Middleware } from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

const unauthorizedMiddleware: Middleware = {
  async onResponse({ response }) {
    console.log(
      "Status in openapi-fetch:",
      Date.now(),
      // `${response.url} => ${response.status}`
      `=> ${response.status}`,
      response
    );

    if ([401].includes(response.status)) {
      console.log("Would call logout here due to 401");
      // TODO: how to logout????
      window.location.href = "/";
    }

    return response;
  },
};

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});

export const MockTwinAPI = createClient({
  baseUrl: "",
});

TwinsAPI.use(unauthorizedMiddleware);
MockTwinAPI.use(unauthorizedMiddleware);
