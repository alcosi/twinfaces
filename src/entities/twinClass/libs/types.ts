import { RequireFields } from "@/shared/libs";
import { TwinClass } from "../api";

export type TwinClass_SHORT = RequireFields<TwinClass, "id" | "key">;

export type TwinClass_DETAILED = RequireFields<
  TwinClass,
  | "logo"
  | "id"
  | "key"
  | "name"
  | "description"
  | "createdAt"
  | "abstractClass"
  | "markersDataListId"
  | "tagsDataListId"
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
