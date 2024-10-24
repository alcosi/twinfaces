import { ComboboxFormField } from "@/components/form-fields/combobox-form-field";
import { TextFormField } from "@/components/form-fields/text-form-field";
import {
  TWIN_CLASS_LINK_STRENGTH,
  TWIN_CLASS_LINK_TYPES,
} from "@/entities/twinClassLink";

export function TwinClassLinkFormFields({
  control,
  isForward = true,
}: {
  control: any;
  isForward?: boolean;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name={isForward ? "srcTwinClassId" : "dstTwinClassId"}
        label={isForward ? "Source Twin Class ID" : "Destination Twin Class ID"}
        disabled={isForward}
      />
      <TextFormField
        control={control}
        name={isForward ? "dstTwinClassId" : "srcTwinClassId"}
        label={isForward ? "Destination Twin Class ID" : "Source Twin Class ID"}
      />
      <TextFormField control={control} name="name" label="Link Name" />
      <ComboboxFormField
        control={control}
        name="type"
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
        name="linkStrength"
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
