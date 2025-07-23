import { DataListOptionV3 } from "@/entities/datalist-option";
import { TwinClassField } from "@/entities/twin-class-field";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields, createEnum } from "@/shared/libs";

import { TWIN_FIELD_TYPES } from "./constants";

export type TwinFieldUI = RequireFields<
  TwinClassField,
  "id" | "key" | "descriptor"
> & {
  value: string | DataListOptionV3 | Twin | User;
};

export type TwinClassFieldDescriptorTextV1 =
  components["schemas"]["TwinClassFieldDescriptorTextV1"];

export const TwinFieldType = createEnum(TWIN_FIELD_TYPES.slice());
