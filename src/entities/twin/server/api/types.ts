import { DataListOptionV1 } from "@/entities/datalist-option";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { TwinStatus } from "@/entities/twin-status";
import { TwinFieldUI } from "@/entities/twinField";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

type TwinSchema = components["schemas"]["TwinV2"];

type TwinRelations = {
  twinClass?: TwinClass_DETAILED;
  status?: TwinStatus;
  authorUser?: User;
  assignerUser?: User;
  ownerUser?: User;
  headTwin?: TwinSchema;
  transitions?: TwinFlowTransition[];
  tags?: DataListOptionV1[];
  markers?: DataListOptionV1[];
};

export type Twin = TwinSchema & TwinRelations;

export type Twin_HYDRATED = Omit<Twin, "fields"> & {
  fields?: {
    [key: string]: TwinFieldUI;
  };
  fieldRules?: Record<string, unknown>;

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
  "classId"
>;
export type TwinCreateRsV1 = components["schemas"]["TwinCreateRsV1"];
export type TwinUpdateRq = components["schemas"]["TwinUpdateRqV1"];
export type TwinViewQuery = operations["twinViewV2"]["parameters"]["query"];
export type TwinTagManageV1 = TwinUpdateRq["tagsUpdate"];

export type TwinLinkAddRqV1 = components["schemas"]["TwinLinkAddRqV1"];
export type HistoryV1 = components["schemas"]["HistoryV1"];
export type History_DETAILED = HistoryV1 & {
  actorUser?: User;
  machineUser?: User;
  twinClassField?: TwinClassField_DETAILED;
};
export type HistoryFilterKeys =
  | "idList"
  | "twinIdList"
  | "twinClassFieldIdList"
  | "actorUserIdList"
  | "typeList"
  | "createdAtFrom"
  | "createdAtTo";
export type HistoryFilters = Partial<
  Pick<
    components["schemas"]["HistorySearchV1"] & {
      createdAtFrom: string;
      createdAtTo: string;
    },
    HistoryFilterKeys
  >
>;
export type HistoryType = NonNullable<HistoryV1["type"]>;
export const HISTORY_TYPES: HistoryType[] = [
  "twinCreated",
  "headChanged",
  "statusChanged",
  "nameChanged",
  "descriptionChanged",
  "createdByChanged",
  "assigneeChanged",
  "assigneeUnassigned",
  "ownerChanged",
  "externalIdChanged",
  "fieldCreated",
  "fieldCreatedOnCreate",
  "fieldChanged",
  "fieldDeleted",
  "markerChanged",
  "tagChanged",
  "attachmentCreate",
  "attachmentCreateOnCreate",
  "attachmentDelete",
  "attachmentUpdate",
  "commentCreate",
  "linkCreated",
  "linkCreatedOnCreate",
  "linkUpdated",
  "linkDeleted",
  "twinDeleted",
  "spaceRoleUserAdded",
  "spaceRoleUserAddedOnCreate",
  "spaceRoleUserRemoved",
  "unknown",
] as const;

export type TwinAttachmentCreateRq =
  components["schemas"]["AttachmentCreateRqV1"];

// ===== Filters =====
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
export type TwinFiltersBySearchId = Partial<
  Pick<components["schemas"]["TwinSearchExtendedV1"], TwinFilterKeys>
>;
// ===== Filters =====
