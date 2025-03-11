import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClassOwnerType = components["schemas"]["TwinClassOwnerTypeV1"];
export type DomainView = components["schemas"]["DomainViewRsv1"];
export type DomainViewPublic = components["schemas"]["DomainViewPublicRsv1"];
export type DomainView_SHORT = RequireFields<DomainView, "id" | "key">;
export type DomainView_DETAILED = RequireFields<
  DomainView_SHORT,
  | "businessAccountTemplateTwinId"
  | "createdAt"
  | "defaultLocale"
  | "description"
  | "permissionSchemaId"
  | "twinClassSchemaId"
  | "twinflowSchemaId"
  | "type"
>;

export type DomainAddRqV1 = components["schemas"]["DomainCreateRqDTOv1"];
export type DomainViewQuery =
  operations["domainViewPublicV1"]["parameters"]["query"];
