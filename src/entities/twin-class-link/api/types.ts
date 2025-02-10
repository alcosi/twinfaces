import { components, operations } from "@/shared/api/generated/schema";

export type UpdateLinkRequestBody = components["schemas"]["LinkUpdateV1"];

export type LinkSearchQuery = operations["linkSearchV1"]["parameters"]["query"];

export type QueryLinkViewV1 = operations["linkViewV1"]["parameters"]["query"];
