import { Control } from "react-hook-form";

import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import { ConditionSetFieldValues } from "@/entities/factory-condition-set";

export function ConditionSetFields({
  control,
}: {
  control: Control<ConditionSetFieldValues>;
}) {
  return (
    <>
      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
