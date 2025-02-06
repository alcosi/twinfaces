import { ComboboxFormField } from "@/components/form-fields/combobox";
import { TextFormField } from "@/components/form-fields";
import {
  useTwinClassLinkStrengthSelectAdapter,
  useTwinClassLinkTypeSelectAdapter,
} from "@/entities/twin-class-link";
import { TwinClassSelectField } from "@/features/twinClass";
import { Control, FieldValues, Path } from "react-hook-form";

export function TwinClassRelationsFormFields<T extends FieldValues>({
  control,
  isForward,
}: {
  control: Control<T>;
  isForward?: boolean;
}) {
  const typeAdapter = useTwinClassLinkTypeSelectAdapter();
  const strengthAdapter = useTwinClassLinkStrengthSelectAdapter();

  return (
    <>
      <TwinClassSelectField
        control={control}
        name={"srcTwinClassId" as Path<T>}
        label="Source Twin Class"
        disabled={isForward}
      />
      <TwinClassSelectField
        control={control}
        name={"dstTwinClassId" as Path<T>}
        label="Destination Twin Class"
        disabled={!isForward}
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
