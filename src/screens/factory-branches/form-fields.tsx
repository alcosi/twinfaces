import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
} from "@/components/form-fields";
import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { isPopulatedArray } from "@/shared/libs";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";

export function FactoryBrancheFormFields<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  const fcsAdapter = useFactoryConditionSetSelectAdapter();
  const fAdapter = useFactorySelectAdapter();
  const fWatch = useWatch({ control, name: "factoryId" as Path<T> });
  const disabled = isPopulatedArray(fWatch);

  return (
    <>
      <ComboboxFormField
        control={control}
        name={"factoryId" as Path<T>}
        label="Factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabled}
        {...fAdapter}
      />

      <ComboboxFormField
        control={control}
        name={"factoryConditionSetId" as Path<T>}
        label="Condition set"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...fcsAdapter}
      />

      <CheckboxFormField
        control={control}
        name={"factoryConditionSetInvert" as Path<T>}
        label="Condition set invert"
      />

      <TextAreaFormField
        control={control}
        name={"description" as Path<T>}
        label="Description"
      />

      <CheckboxFormField
        control={control}
        name={"active" as Path<T>}
        label="Active"
      />

      <ComboboxFormField
        control={control}
        name={"nextFactoryId" as Path<T>}
        label="Next factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...fAdapter}
      />
    </>
  );
}
