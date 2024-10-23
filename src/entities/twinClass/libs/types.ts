import { components } from "@/lib/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClass_SHORT = RequireFields<TwinClass, "id" | "key">;
export type TwinClass_DETAILED = RequireFields<
  TwinClass,
  "logo" | "id" | "key" | "name" | "description" | "createdAt" | "abstractClass"
>;
export type TwinClass_MANAGED = RequireFields<
  TwinClass,
  | "id"
  | "key"
  | "name"
  | "description"
  | "createdAt"
  | "abstractClass"
  | "aliasSpace"
  | "ownerType"
  | "permissionSchemaSpace"
  | "twinClassSchemaSpace"
  | "twinflowSchemaSpace"
>;
