import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { ComboboxFormField } from "@/components/form-fields/combobox-form-field";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { TwinClass_DETAILED, useTwinClassSearchV1 } from "@/entities/twinClass";
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
  const { searchTwinClasses } = useTwinClassSearchV1();

  // NOTE: currently this function is never called
  // TODO: investigate in context of https://alcosi.atlassian.net/browse/TWINFACES-76
  async function getById(): Promise<undefined> {
    return undefined;
  }

  // TODO: Add debounce-logic after https://alcosi.atlassian.net/browse/TWINFACES-77
  async function getItems(search: string): Promise<TwinClass_DETAILED[]> {
    try {
      const { data } = await searchTwinClasses({ search });
      return data.filter((item) => item.id !== twinClass?.id);
    } catch (error) {
      console.error("Error fetching search items:", error);
      return [];
    }
  }

  // TODO: to refactor after https://alcosi.atlassian.net/browse/TWINFACES-76
  return props.disabled ? (
    <TextFormItem
      {...props}
      value={`${twinClass?.key}${twinClass?.name ? ` (${twinClass?.name})` : ""}`}
    />
  ) : (
    <ComboboxFormField
      getById={getById}
      getItems={getItems}
      getItemKey={(item) => item.id!}
      getItemLabel={({ key = "", name }) => `${key}${name ? ` (${name})` : ""}`}
      selectPlaceholder="Select twin class"
      searchPlaceholder="Search twin class..."
      noItemsText={"No classes found"}
      {...props}
    />
  );
}
