import { Control, Path } from "react-hook-form";

import { TwinFormValues, TwinSelfFieldId } from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { isPopulatedArray } from "@/shared/libs";

import { TwinFieldFormField } from "../../../../form-fields";

type BuildFieldElementsParams = {
  fields: TwinClassField[];
  control: Control<TwinFormValues>;
  selectedClass: unknown;
};

const nameMap: Partial<Record<TwinSelfFieldId, Path<TwinFormValues>>> = {
  "00000000-0000-0000-0011-000000000003": "name",
  "00000000-0000-0000-0011-000000000007": "assignerUserId",
  "00000000-0000-0000-0011-000000000004": "description",
  "00000000-0000-0000-0011-000000000005": "externalId",
};

export function buildFieldElements({
  fields,
  control,
  selectedClass,
}: BuildFieldElementsParams) {
  return fields.map((field) => {
    const name: Path<TwinFormValues> =
      nameMap[field.id as TwinSelfFieldId] ??
      (`fields.${field.key}` as Path<TwinFormValues>);

    return (
      <TwinFieldFormField
        key={field.key}
        name={name}
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
