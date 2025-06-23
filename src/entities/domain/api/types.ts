import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClassOwnerType = components["schemas"]["TwinClassOwnerTypeV1"];

export type DomainView = components["schemas"]["DomainViewV1"];
//TODO remove name?: string; by updating schema
export type DomainView_SHORT = RequireFields<DomainView, "id" | "key"> & {
  name?: string;
};
export type DomainView_DETAILED = RequireFields<
  DomainView_SHORT,
  | "businessAccountTemplateTwinId"
  | "createdAt"
  | "defaultLocale"
  | "description"
  | "navbarFaceId"
  | "permissionSchemaId"
  | "twinClassSchemaId"
  | "twinflowSchemaId"
  | "type"
>;

export type DomainPublicView = components["schemas"]["DomainViewPublicV1"];

export type DomainAddRqV1 = components["schemas"]["DomainCreateRqV1"];
export type DomainViewQuery =
  operations["domainViewPublicV1"]["parameters"]["query"];

export type DomainViewRs = components["schemas"]["DomainViewRsv1"];
export type DomainSearchRs = components["schemas"]["DomainSearchRsV1"];
