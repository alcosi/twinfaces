import { ComboboxFormField } from "@/components/form-fields/combobox";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { useContext } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { PermissionContext } from "../context-provider";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
};

export function PermissionSelectField<T extends FieldValues>(props: Props<T>) {
  const { permission } = useContext(PermissionContext);
  const pAdapter = usePermissionSelectAdapter();

  return props.disabled ? (
    <TextFormItem
      {...props}
      value={`${permission?.key}${permission?.name ? ` (${permission?.name})` : ""}`}
    />
  ) : (
    <ComboboxFormField
      selectPlaceholder="Select permission"
      searchPlaceholder="Search permission..."
      noItemsText={"No classes found"}
      {...pAdapter}
      {...props}
    />
  );
}
