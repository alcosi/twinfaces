import { components, operations } from "@/shared/api/generated/schema";

export type PermissionSchema = components["schemas"]["PermissionSchemaV2"] & {
  // NOTE: This is a workaround! Please remove after comment is resolved
  // https://alcosi.atlassian.net/browse/TWINFACES-460?focusedCommentId=32135
  createdAt?: string;
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
