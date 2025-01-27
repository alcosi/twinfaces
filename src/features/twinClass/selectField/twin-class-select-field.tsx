import { ComboboxFormField, TextFormItem } from "@/components/form-fields";
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
  const tcAdapter = useTwinClassSelectAdapter();

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
      {...tcAdapter}
      {...props}
    />
  );
}
