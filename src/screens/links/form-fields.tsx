import { ComboboxFormField, TextFormField } from "@/components/form-fields";
import {
  useLinkStrengthSelectAdapter,
  useLinkTypeSelectAdapter,
} from "@/entities/link";
import { Control, FieldValues, Path } from "react-hook-form";

export function CreateLinkFormFields<T extends FieldValues>({
  control,
  isForward,
  enableAllTwinClasses,
}: {
  control: Control<T>;
  isForward?: boolean;
  enableAllTwinClasses?: boolean;
}) {
  const typeAdapter = useLinkTypeSelectAdapter();
  const strengthAdapter = useLinkStrengthSelectAdapter();

  return (
    <>
      {/* <TwinClassSelectField
        control={control}
        name={"srcTwinClassId" as Path<T>}
        label="Source Twin Class"
        disabled={!enableAllTwinClasses && isForward}
      />
      <TwinClassSelectField
        control={control}
        name={"dstTwinClassId" as Path<T>}
        label="Destination Twin Class"
        disabled={!enableAllTwinClasses && !isForward}
      /> */}
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
