import { z } from "zod";

import { TwinRoleEnum } from "./types";

export const TWIN_ROLE_SCHEMA = z.enum(
  [
    TwinRoleEnum.assignee,
    TwinRoleEnum.creator,
    TwinRoleEnum.space_assignee,
    TwinRoleEnum.space_creator,
  ],
  { message: "Invalid twin role" }
);
