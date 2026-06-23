import { TwinClass_DETAILED } from "@/entities/twin-class";
import type { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinLinkView = components["schemas"]["TwinLinkViewV1"] & {
  link?: Link;
  dstTwin?: Twin;
  createdByUser?: User;
};

export type Link = components["schemas"]["LinkV2"] & {
  srcTwinClass?: TwinClass_DETAILED;
  dstTwinClass?: TwinClass_DETAILED;
  createdByUser?: User;
};
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
  Pick<components["schemas"]["LinkSearchDTOv1"], LinkFilterKeys>
>;

export type LinkSortField = NonNullable<
  components["schemas"]["LinkSearchRqV2"]["sortField"]
>;

export type LinkCountGroupField = NonNullable<
  components["schemas"]["LinkCountRqV1"]["groupFields"]
>[number];

export type LinkCountItem = components["schemas"]["LinkCountV1"] & {
  srcTwinClass?: TwinClass_DETAILED;
  dstTwinClass?: TwinClass_DETAILED;
};

export type QueryLinkViewV1 = operations["linkViewV1"]["parameters"]["query"];
export type CreateLinkRequestBody = components["schemas"]["LinkCreateV1"];
export type UpdateLinkRequestBody = components["schemas"]["LinkUpdateV1"];
