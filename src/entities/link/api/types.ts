import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Link = components["schemas"]["LinkV3"];
export type Link_MANAGED = Partial<
  RequireFields<
    Link,
    | "id"
    | "name"
    | "backwardName"
    | "srcTwinClassId"
    | "srcTwinClass"
    | "dstTwinClassId"
    | "dstTwinClass"
    | "type"
    | "createdAt"
    | "createdByUser"
  >
>;

export type LinkFilterKeys =
  | "idList"
  | "srcTwinClassIdList"
  | "dstTwinClassIdList"
  | "forwardNameLikeList"
  | "backwardNameLikeList"
  | "typeLikeList"
  | "strengthLikeList";

export type LinkFilters = Partial<
  Pick<components["schemas"]["LinkSearchRqV1"], LinkFilterKeys>
>;

export type UpdateLinkRequestBody = components["schemas"]["LinkUpdateV1"];
export type QueryLinkViewV1 = operations["linkViewV1"]["parameters"]["query"];

export type CreateLinkRequestBody = components["schemas"]["LinkCreateV1"];
