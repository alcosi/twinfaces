import { Control, Path } from "react-hook-form";

import { TwinFormValues, TwinSelfFieldId } from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { isPopulatedArray } from "@/shared/libs";

import { TwinFieldFormField } from "../../../../../../widgets/form-fields";
import { TwinSelfFieldRenderer } from "../tc001-form";

type BuildFieldElementsParams = {
  fields: TwinClassField[];
  control: Control<TwinFormValues>;
  selfFields: Partial<Record<string, TwinSelfFieldRenderer>>;
  nameMap: Partial<Record<TwinSelfFieldId, Path<TwinFormValues>>>;
  selectedClass: unknown;
  userAdapter: Record<string, unknown>;
};

export function buildFieldElements({
  fields,
  control,
  selfFields,
  nameMap,
  selectedClass,
  userAdapter,
}: BuildFieldElementsParams) {
  return fields.map((field) => {
    const SelfComponent = selfFields[field.id as keyof typeof selfFields];

    return SelfComponent ? (
      <SelfComponent
        key={field.key}
        control={control}
        name={nameMap[field.id as TwinSelfFieldId]!}
        label={field.name!}
        required={field.required}
        adapter={
          field.id === "00000000-0000-0000-0011-000000000007" ? userAdapter : {}
        }
      />
    ) : (
      <TwinFieldFormField
        key={field.key}
        name={`fields.${field.key}`}
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
