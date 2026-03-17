import { NotificationSchema } from "@/entities/notification";
import { PermissionSchema } from "@/entities/permission-schema";
import { Tier } from "@/entities/tier";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { TwinFlowSchema } from "@/entities/twinFlowSchema";
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
  components["schemas"]["DomainBusinessAccountSearchRqV1"];

export type DomainBusinessAccountFilterKeys =
  | "businessAccountIdList"
  | "permissionSchemaIdList"
  | "twinflowSchemaIdList"
  | "twinClassSchemaIdList"
  | "tierIdList"
  | "storageUsedCountRange"
  | "storageUsedSizeRange";

export type DomainBusinessAccountFilters = Partial<
  Pick<DomainBusinessAccountSearchRq, DomainBusinessAccountFilterKeys>
>;
