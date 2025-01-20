import { ComboboxFormField } from "@/components/form-fields/combobox";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { useContext } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { useDatalistSelectAdapter } from "@/entities/datalist";
import { DatalistContext } from "../context-provider";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
};

export function DatalistSelectField<T extends FieldValues>(props: Props<T>) {
  const { datalist } = useContext(DatalistContext);
  const dlAdapter = useDatalistSelectAdapter();

  return props.disabled ? (
    <TextFormItem
      {...props}
      value={`${datalist?.key}${datalist?.name ? ` (${datalist?.name})` : ""}`}
    />
  ) : (
    <ComboboxFormField
      selectPlaceholder="Select datalist"
      searchPlaceholder="Search datalist..."
      noItemsText={"No classes found"}
      {...dlAdapter}
      {...props}
    />
  );
}
