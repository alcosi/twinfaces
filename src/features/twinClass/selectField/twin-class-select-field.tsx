import { ComboboxFormField } from "@/components/form-fields/combobox";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import {
  TwinClassContext,
  useTwinClassSelectAdapter,
} from "@/entities/twinClass";
import { useContext } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
};

export function TwinClassSelectField<T extends FieldValues>(props: Props<T>) {
  const { twinClass } = useContext(TwinClassContext);
  const { getById, getItems, getItemKey, getItemLabel } =
    useTwinClassSelectAdapter();

  // TODO: to refactor after https://alcosi.atlassian.net/browse/TWINFACES-76
  return props.disabled ? (
    <TextFormItem
      {...props}
      value={`${twinClass?.key}${twinClass?.name ? ` (${twinClass?.name})` : ""}`}
    />
  ) : (
    <ComboboxFormField
      selectPlaceholder="Select twin class"
      searchPlaceholder="Search twin class..."
      noItemsText={"No classes found"}
      getById={getById}
      getItems={getItems}
      getItemKey={getItemKey}
      getItemLabel={getItemLabel}
      {...props}
    />
  );
}
