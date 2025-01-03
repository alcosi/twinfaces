import { components } from "@/shared/api/generated/schema";

export type PermissionSchema = components["schemas"]["PermissionSchemaV2"];

export type PermissionSchemaSearchFilterKeys = "nameLikeList";
export type PermissionSchemaSearchFilters = Partial<
  Pick<
    components["schemas"]["PermissionSchemaSearchRqV1"],
    PermissionSchemaSearchFilterKeys
  >
>;
