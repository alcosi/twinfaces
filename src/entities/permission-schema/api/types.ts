import { BusinessAccount } from "@/entities/business-account";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";

export type PermissionSchema = components["schemas"]["PermissionSchemaV1"] & {
  createdByUser?: User;
  businessAccount?: BusinessAccount;
};

export type PermissionSchemaSearchFilterKeys = "nameLikeList";
export type PermissionSchemaSearchFilters = Partial<
  Pick<
    components["schemas"]["PermissionSchemaSearchRqV1"],
    PermissionSchemaSearchFilterKeys
  >
>;

export type PermissionSchemaFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "createdByUserIdList";

export type PermissionSchemaFilters = Partial<
  Pick<
    components["schemas"]["PermissionSchemaSearchRqV1"],
    PermissionSchemaFilterKeys
  >
>;

export type PermissionSchemaRqQuery =
  operations["permissionSchemaViewV1"]["parameters"]["query"];
