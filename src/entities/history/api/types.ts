import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";

export type History = components["schemas"]["HistoryV1"];
export type History_DETAILED = History & {
  actorUser?: User;
  machineUser?: User;
  twinClassField?: TwinClassField_DETAILED;
  twin?: Twin_DETAILED;
};
export type HistoryFilterKeys =
  | "idList"
  | "twinIdList"
  | "twinClassFieldIdList"
  | "actorUserIdList"
  | "typeList"
  | "createdAt";
export type HistoryFilters = Partial<
  Pick<components["schemas"]["HistorySearchV1"], HistoryFilterKeys>
>;
export type HistoryType = NonNullable<History["type"]>;
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
