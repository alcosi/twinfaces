import { env } from "next-runtime-env";
import createClient from "openapi-fetch";

import { paths } from "@/shared/api/generated/schema";

export const TwinsAPI = createClient<paths>({
  baseUrl: env("NEXT_PUBLIC_TWINS_API_URL"),
});
