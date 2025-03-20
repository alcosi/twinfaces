import { components } from "@/shared/api/generated/schema";

export type Tier = components["schemas"]["TierV2"];
export type Tier_DETAILED = Required<Tier>;

export type TierFilterKeys =
  | "idList"
  | "nameLikeList"
  | "custom"
  | "permissionSchemaIdList"
  | "twinflowSchemaIdList"
  | "attachmentsStorageQuotaCountRange"
  | "attachmentsStorageQuotaSizeRange"
  | "userCountQuotaRange"
  | "descriptionLikeList";

export type TierFilters = Partial<
  Pick<components["schemas"]["TierSearchRqV1"], TierFilterKeys>
>;
