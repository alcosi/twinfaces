import { createEnum } from "@/shared/libs";

import { PermissionGrantTwinRoles } from "../api";

export type TwinRole = NonNullable<PermissionGrantTwinRoles["twinRole"]>;
export const TWIN_ROLE: TwinRole[] = [
  "assignee",
  "creator",
  "space_assignee",
  "space_creator",
  "watcher",
] as const;
export const TwinRoleEnum = createEnum<TwinRole>(TWIN_ROLE);
