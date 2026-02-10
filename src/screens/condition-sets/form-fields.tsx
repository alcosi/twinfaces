import { Control } from "react-hook-form";

import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { ConditionSetFieldValues } from "@/entities/factory-condition-set";

export function ConditionSetFields({
  control,
}: {
  control: Control<ConditionSetFieldValues>;
}) {
  const factoryAdapter = useFactorySelectAdapter();

  return (
    <>
      <TextFormField control={control} name="name" label="Name" />

      <ComboboxFormField
        control={control}
        name="twinFactoryId"
        label="Factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryAdapter}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
