import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinLinkView = components["schemas"]["TwinLinkViewV1"];

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

export type QueryLinkViewV1 = operations["linkViewV1"]["parameters"]["query"];
export type CreateLinkRequestBody = components["schemas"]["LinkCreateV1"];
export type UpdateLinkRequestBody = components["schemas"]["LinkUpdateV1"];
