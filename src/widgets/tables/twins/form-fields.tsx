import { Control } from "react-hook-form";

import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { TwinFormValues } from "@/entities/twin";

import { TwinFieldFormField } from "../../form-fields";
import { useTwinClassFields } from "./use-twin-form-fields";

export function TwinFormFields({
  control,
  baseTwinClassId,
}: {
  control: Control<TwinFormValues>;
  baseTwinClassId?: string;
}) {
  const {
    selectedTwinClass,
    twinClassAdapter,
    fields,
    userAdapter,
    hasHeadClass,
    headAdapter,
    hasTagDataList,
    optionAdapter,
  } = useTwinClassFields(control, baseTwinClassId);

  return (
    <>
      <ComboboxFormField
        control={control}
        name="classId"
        label="Class"
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...twinClassAdapter}
      />

      {hasHeadClass && (
        <ComboboxFormField
          name="headTwinId"
          control={control}
          label="Head"
          {...headAdapter}
          required
        />
      )}

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <ComboboxFormField
        name="assignerUserId"
        control={control}
        label="Assignee"
        {...userAdapter}
      />

      {fields.map((field) => (
        <TwinFieldFormField
          key={field.key}
          name={`fields.${field.key!}`}
          control={control}
          label={field.name}
          twinClassId={selectedTwinClass!.id}
          descriptor={field.descriptor}
          required={field.required}
        />
      ))}

      {hasTagDataList && (
        <ComboboxFormField
          control={control}
          name="tags"
          label="Tags"
          multi
          creatable
          {...optionAdapter}
        />
      )}
    </>
  );
}
