import { ComboboxFormField } from "@/components/form-fields/combobox-form-field";
import { TextFormField } from "@/components/form-fields/text-form-field";
import {
  TWIN_CLASS_LINK_STRENGTH,
  TWIN_CLASS_LINK_TYPES,
} from "@/entities/twinClassLink";
import { TwinClassSelectField } from "@/features/twinClass";
import { Control, FieldValues, Path } from "react-hook-form";

export function TwinClassLinkFormFields<T extends FieldValues>({
  control,
  isForward,
}: {
  control: Control<T>;
  isForward?: boolean;
}) {
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
        getById={async (id) => TWIN_CLASS_LINK_TYPES.find((i) => i.id === id)}
        getItems={async () => TWIN_CLASS_LINK_TYPES}
        getItemKey={({ id }) => id}
        getItemLabel={({ label }) => label}
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
      />
      <ComboboxFormField
        control={control}
        name={"linkStrength" as Path<T>}
        label="Link Strength"
        getById={async (id) =>
          TWIN_CLASS_LINK_STRENGTH.find((i) => i.id === id)
        }
        getItems={async () => TWIN_CLASS_LINK_STRENGTH}
        getItemKey={({ id }) => id}
        getItemLabel={({ label }) => label}
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
      />
    </>
  );
}
