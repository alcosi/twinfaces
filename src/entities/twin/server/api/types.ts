import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Twin = components["schemas"]["TwinV2"];
export type Twin_SHORT = RequireFields<
  Twin,
  | "id"
  | "name"
  | "assignerUserId"
  | "authorUserId"
  | "markerIdList"
  | "statusId"
  | "tagIdList"
  | "twinClassId"
>;
export type Twin_DETAILED = RequireFields<
  Twin_SHORT,
  "twinClass" | "createdAt" | "headTwinId" | "tags"
> & {
  subordinates?: TwinClass_DETAILED[];
};

export type TwinAttachments = components["schemas"]["AttachmentV1"];

export type TwinCreateRq = RequireFields<
  components["schemas"]["TwinCreateRqV2"],
  "classId" | "name" | "assignerUserId"
>;
export type TwinCreateRsV1 = components["schemas"]["TwinCreateRsV1"];
export type TwinUpdateRq = components["schemas"]["TwinUpdateRqV1"];
export type TwinViewQuery = operations["twinViewV2"]["parameters"]["query"];
export type TwinTagManageV1 = TwinUpdateRq["tagsUpdate"];

export type TwinLinkAddRqV1 = components["schemas"]["TwinLinkAddRqV1"];
export type HistoryV1 = components["schemas"]["HistoryV1"];

export type TwinFilterKeys =
  | "twinIdList"
  | "twinNameLikeList"
  | "twinClassIdList"
  | "statusIdList"
  | "descriptionLikeList"
  | "twinClassExtendsHierarchyContainsIdList"
  | "headTwinIdList"
  | "createdByUserIdList"
  | "assignerUserIdList";

export type TwinFilters = Partial<
  Pick<components["schemas"]["TwinSearchRqV1"], TwinFilterKeys>
>;

export type TwinSimpleFilters = components["schemas"]["TwinSearchSimpleV1"];
