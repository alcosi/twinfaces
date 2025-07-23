import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinFieldUI } from "@/entities/twinField";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Twin = components["schemas"]["TwinV2"];

export type Twin_HYDRATED = Omit<components["schemas"]["TwinV2"], "fields"> & {
  fields?: {
    [key: string]: TwinFieldUI;
  };
  ownerUser?: User;

  // TODO: implement selfFields, inheritedFields, and allFields (combined)
  // selfFields?: Record<string, unknown>;
  // inheritedFields?: Record<string, unknown>;
  // fields?: Record<string, unknown>; | allFields?: Record<string, unknown>;
};

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
> &
  Twin_HYDRATED & {
    subordinates?: TwinClass_DETAILED[];
  };

export type TwinCreateRq = RequireFields<
  components["schemas"]["TwinCreateRqV2"],
  "classId" | "name"
>;
export type TwinCreateRsV1 = components["schemas"]["TwinCreateRsV1"];
export type TwinUpdateRq = components["schemas"]["TwinUpdateRqV1"];
export type TwinViewQuery = operations["twinViewV2"]["parameters"]["query"];
export type TwinTagManageV1 = TwinUpdateRq["tagsUpdate"];

export type TwinLinkAddRqV1 = components["schemas"]["TwinLinkAddRqV1"];
export type HistoryV1 = components["schemas"]["HistoryV1"];
export type TwinAttachmentCreateRq =
  components["schemas"]["AttachmentCreateRqV1"];

export type TwinFilterKeys =
  | "twinIdList"
  | "twinNameLikeList"
  | "twinClassIdList"
  | "statusIdList"
  | "descriptionLikeList"
  | "twinClassExtendsHierarchyContainsIdList"
  | "headTwinIdList"
  | "createdByUserIdList"
  | "assignerUserIdList"
  | "fields"
  | "createdAt";

export type TwinFilters = Partial<
  Pick<components["schemas"]["TwinSearchRqV1"], TwinFilterKeys>
>;

export type TwinSimpleFilters = components["schemas"]["TwinSearchSimpleV1"];
