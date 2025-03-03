import { z } from "zod";

import { TwinRole, TwinRoleEnum } from "./types";

export const TWIN_ROLE_SCHEMA = z.enum(
  [
    TwinRoleEnum.assignee,
    TwinRoleEnum.creator,
    TwinRoleEnum.space_assignee,
    TwinRoleEnum.space_creator,
    TwinRoleEnum.watcher,
  ],
  { message: "Invalid twin role" }
);

export const TWIN_ROLE_ENUM: Array<{
  id: TwinRole;
  label: string;
}> = [
  { id: TwinRoleEnum.assignee, label: "Assingee" },
  { id: TwinRoleEnum.creator, label: "Creator" },
  { id: TwinRoleEnum.space_assignee, label: "Space assignee" },
  { id: TwinRoleEnum.space_creator, label: "Space creator" },
  { id: TwinRoleEnum.watcher, label: "Watcher" },
] as const;
