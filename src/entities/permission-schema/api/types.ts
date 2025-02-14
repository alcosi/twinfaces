import { components } from "@/shared/api/generated/schema";

export type PermissionSchema = components["schemas"]["PermissionSchemaV2"];

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
