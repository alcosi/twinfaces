import { NotificationSchema } from "@/entities/notification";
import { PermissionSchema } from "@/entities/permission-schema";
import { Tier } from "@/entities/tier";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { TwinFlowSchema } from "@/entities/twinFlowSchema";
import { User_DETAILED } from "@/entities/user";
import { UserGroup_DETAILED } from "@/entities/user-group";
import { components } from "@/shared/api/generated/schema";

export type BusinessAccount = components["schemas"]["BusinessAccountV1"];

export type DomainBusinessAccount =
  components["schemas"]["DomainBusinessAccountV1"];

export type DomainBusinessAccount_DETAILED = DomainBusinessAccount & {
  businessAccount: BusinessAccount;
  permissionSchema: PermissionSchema;
  twinflowSchema: TwinFlowSchema;
  twinClassSchema: TwinClassSchema;
  notificationSchema: NotificationSchema;
  tier: Tier;
};

export type DomainBusinessAccountSearchRq =
  components["schemas"]["DomainBusinessAccountSearchDTOv1"];

export type DomainBusinessAccountFilterKeys =
  | "idList"
  | "businessAccountIdList"
  | "permissionSchemaIdList"
  | "twinflowSchemaIdList"
  | "twinClassSchemaIdList"
  | "notificationSchemaIdList"
  | "tierIdList"
  | "storageUsedCountRange"
  | "storageUsedSizeRange"
  | "createdAt";

export type DomainBusinessAccountFilters = Partial<
  Pick<DomainBusinessAccountSearchRq, DomainBusinessAccountFilterKeys>
>;

export type DomainBusinessAccountFilterFormKeys =
  | Exclude<DomainBusinessAccountFilterKeys, "businessAccountIdList">
  | "businessAccountIdTagList"
  | "businessAccountIdComboboxList";

export type DomainBusinessAccountCountRq =
  components["schemas"]["DomainBusinessAccountCountRqV1"];

export type DomainBusinessAccountCountGroupField = NonNullable<
  DomainBusinessAccountCountRq["groupFields"]
>[number];

export type DomainBusinessAccountUser =
  components["schemas"]["DomainBusinessAccountUserV1"];

export type DomainBusinessAccountUser_DETAILED = DomainBusinessAccountUser & {
  user: User_DETAILED;
  businessAccount: DomainBusinessAccount_DETAILED;
  userGroups: UserGroup_DETAILED[];
};

export type DomainBusinessAccountUserSearchRq =
  components["schemas"]["DomainBusinessAccountUserSearchDTOv1"];

export type DomainBusinessAccountUserFilterKeys =
  | "businessAccountIdList"
  | "userIdList"
  | "userGroupIdList"
  | "createdAt"
  | "lastActivityAt";

export type DomainBusinessAccountUserFilters = Partial<
  Pick<DomainBusinessAccountUserSearchRq, DomainBusinessAccountUserFilterKeys>
>;

export type DomainBusinessAccountUserCountRq =
  components["schemas"]["DomainBusinessAccountUserCountRqV1"];

export type DomainBusinessAccountUserCountGroupField = NonNullable<
  DomainBusinessAccountUserCountRq["groupFields"]
>[number];

export type DomainBusinessAccountUserCount =
  components["schemas"]["DomainBusinessAccountUserCountV1"];
