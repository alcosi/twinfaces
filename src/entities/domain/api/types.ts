import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type DomainView = components["schemas"]["DomainViewRsv1"];
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
