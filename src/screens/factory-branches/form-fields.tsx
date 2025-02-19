import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
} from "@/components/form-fields";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { Control, FieldValues, Path } from "react-hook-form";

export function FactoryBrancheFormFields<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  const fcsAdapter = useFactoryConditionSetSelectAdapter();

  return (
    <>
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
    </>
  );
}
