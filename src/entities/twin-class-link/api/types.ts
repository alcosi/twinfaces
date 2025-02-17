import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClassLink = components["schemas"]["LinkV3"];
export type TwinClassLink_MANAGED = RequireFields<
  TwinClassLink,
  | "id"
  | "name"
  | "backwardName"
  | "srcTwinClassId"
  | "srcTwinClass"
  | "dstTwinClassId"
  | "dstTwinClass"
  | "type"
  | "createdAt"
>;

export type CreateLinkRequestBody = components["schemas"]["LinkCreateV1"];
export type UpdateLinkRequestBody = components["schemas"]["LinkUpdateV1"];

export type LinkSearchQuery = operations["linkSearchV1"]["parameters"]["query"];
export type LinkSearchFilterKeys =
  | "idList"
  | "idExcludeList"
  | "srcTwinClassIdList"
  | "srcTwinClassIdExcludeList"
  | "dstTwinClassIdList"
  | "dstTwinClassIdExcludeList"
  | "srcOrDstTwinClassIdList"
  | "srcOrDstTwinClassIdExcludeList"
  | "forwardNameLikeList"
  | "forwardNameNotLikeList"
  | "backwardNameLikeList"
  | "backwardNameNotLikeList"
  | "typeLikeList"
  | "typeNotLikeList"
  | "strengthLikeList"
  | "strengthNotLikeList";
export type LinkSearchFilters = Partial<
  Pick<components["schemas"]["LinkSearchRqV1"], LinkSearchFilterKeys>
>;

export type QueryLinkViewV1 = operations["linkViewV1"]["parameters"]["query"];
