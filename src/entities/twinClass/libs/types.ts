import { RequireFields } from "@/shared/libs";
import { z } from "zod";
import { TwinClass } from "../api";
import { TWIN_CLASSES_SCHEMA } from "./constants";

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

// Form Types
export type TwinClassFieldValues = z.infer<typeof TWIN_CLASSES_SCHEMA>;
