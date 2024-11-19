import { ComboboxFormField } from "@/components/form-fields/combobox";
import { FormFieldProps } from "@/components/form-fields/form-fields-common";
import { useTwinStatusSelectAdapter } from "@/entities/twinStatus";
import { Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  twinClassId?: string;
  control: Control<T>;
  name: Path<T>;
  label: string;
} & FormFieldProps<T>;

export function TwinStatusSelectField<T extends FieldValues>(props: Props<T>) {
  const { getById, getItems, getItemKey, getItemLabel } =
    useTwinStatusSelectAdapter(props.twinClassId);

  return (
    <ComboboxFormField
      getById={getById}
      getItems={getItems}
      getItemKey={getItemKey}
      getItemLabel={getItemLabel}
      selectPlaceholder="Select status"
      searchPlaceholder="Search status..."
      noItemsText={"No statuses found"}
      {...props}
    />
  );
}
