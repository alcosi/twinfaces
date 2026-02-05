import { PermissionSchema } from "@/entities/permission-schema";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { TwinFlowSchema } from "@/entities/twinFlowSchema";
import { components } from "@/shared/api/generated/schema";

export type Tier = components["schemas"]["TierV1"] & {
  permissionSchema?: PermissionSchema;
  twinClassSchema?: TwinClassSchema;
  twinflowSchema?: TwinFlowSchema;
};
export type Tier_DETAILED = Required<Tier>;

export type TierFilterKeys =
  | "idList"
  | "nameLikeList"
  | "custom"
  | "permissionSchemaIdList"
  | "twinflowSchemaIdList"
  | "twinclassSchemaIdList"
  | "attachmentsStorageQuotaCountRange"
  | "attachmentsStorageQuotaSizeRange"
  | "userCountQuotaRange"
  | "descriptionLikeList";

export type TierFilters = Partial<
  Pick<components["schemas"]["TierSearchRqV1"], TierFilterKeys>
>;
