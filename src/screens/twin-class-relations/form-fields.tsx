import { TextFormField } from "@/components/form-fields";
import { ComboboxFormField } from "@/components/form-fields/combobox";
import {
  useTwinClassLinkStrengthSelectAdapter,
  useTwinClassLinkTypeSelectAdapter,
} from "@/entities/twin-class-link";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { Control, FieldValues, Path } from "react-hook-form";

export function TwinClassRelationsFormFields<T extends FieldValues>({
  control,
  isForward,
}: {
  control: Control<T>;
  isForward?: boolean;
}) {
  const tcAdapter = useTwinClassSelectAdapter();
  const typeAdapter = useTwinClassLinkTypeSelectAdapter();
  const strengthAdapter = useTwinClassLinkStrengthSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name={"srcTwinClassId" as Path<T>}
        label="Source Twin Class"
        disabled={isForward}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
      />
      <ComboboxFormField
        control={control}
        name={"dstTwinClassId" as Path<T>}
        label="Destination Twin Class"
        disabled={!isForward}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
      />
      <TextFormField
        control={control}
        name={"name" as Path<T>}
        label="Link Name"
      />
      <ComboboxFormField
        control={control}
        name={"type" as Path<T>}
        label="Link Type"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...typeAdapter}
      />
      <ComboboxFormField
        control={control}
        name={"linkStrength" as Path<T>}
        label="Link Strength"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...strengthAdapter}
      />
    </>
  );
}
