import { DataListOptionV1 } from "@/entities/datalist-option";
import { TwinClassField } from "@/entities/twin-class-field";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";
import { RequireFields, createEnum } from "@/shared/libs";

import { TWIN_FIELD_TYPES } from "./constants";

export type FieldAttribute = components["schemas"]["TwinFieldAttributeV1"];

/** A field value resolved against `relatedObjects` into a domain object. */
export type TwinFieldValueObject = DataListOptionV1 | Twin | User;

export type TwinFieldUI = RequireFields<
  TwinClassField,
  "id" | "key" | "descriptor"
> & {
  /**
   * The raw wire value (an id, or comma-separated ids for `multiple` fields),
   * or its resolved form — one object per id.
   */
  value: string | TwinFieldValueObject | TwinFieldValueObject[];
  attributes?: FieldAttribute[];
  /**
   * Whether the server allows editing this field on this twin. Absent means the
   * response did not report it — see {@link isTwinFieldEditable}.
   */
  editable?: boolean;
};

export type TwinClassFieldDescriptorTextV1 =
  components["schemas"]["TwinClassFieldDescriptorTextV1"];

export const TwinFieldType = createEnum(TWIN_FIELD_TYPES.slice());
