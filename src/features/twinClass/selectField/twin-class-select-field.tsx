import { ComboboxFormField } from "@/components/form-fields";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
};

export function TwinClassSelectField<T extends FieldValues>(props: Props<T>) {
  const tcAdapter = useTwinClassSelectAdapter();

  return (
    <ComboboxFormField
      selectPlaceholder="Select twin class"
      searchPlaceholder="Search twin class..."
      noItemsText={"No classes found"}
      {...tcAdapter}
      {...props}
    />
  );
}
