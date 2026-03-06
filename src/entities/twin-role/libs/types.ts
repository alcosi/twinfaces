import { createEnum } from "@/shared/libs";

export type TwinRole =
  | "assignee"
  | "creator"
  | "space_assignee"
  | "space_creator";
export const TWIN_ROLE: TwinRole[] = [
  "assignee",
  "creator",
  "space_assignee",
  "space_creator",
] as const;
export const TwinRoleEnum = createEnum<TwinRole>(TWIN_ROLE);
