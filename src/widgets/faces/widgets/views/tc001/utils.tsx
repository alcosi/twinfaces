import { Control, Path } from "react-hook-form";

import {
  TWIN_SELF_FIELD_ID_TO_KEY_MAP,
  TwinFormValues,
  TwinSelfFieldId,
} from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { isPopulatedArray } from "@/shared/libs";

import { TwinFieldFormField } from "../../../../form-fields";

type BuildFieldElementsParams = {
  fields: TwinClassField[];
  control: Control<TwinFormValues>; // ???? 👀
  selectedClass: unknown;
};

export function buildFieldElements({
  fields,
  control,
  selectedClass,
}: BuildFieldElementsParams) {
  return fields.map((field) => {
    const selfTwinFieldKey =
      TWIN_SELF_FIELD_ID_TO_KEY_MAP[field.id as TwinSelfFieldId];

    return (
      <TwinFieldFormField
        key={field.key}
        name={selfTwinFieldKey ?? `fields.${field.key}`}
        control={control}
        label={field.name}
        descriptor={field.descriptor}
        twinClassId={
          isPopulatedArray<{ id: string }>(selectedClass)
            ? selectedClass[0]?.id
            : ""
        }
        required={field.required}
      />
    );
  });
}
