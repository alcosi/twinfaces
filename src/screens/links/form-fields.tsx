import { ComboboxFormField, TextFormField } from "@/components/form-fields";
import {
  LINK_SCHEMA,
  useLinkStrengthSelectAdapter,
  useLinkTypeSelectAdapter,
} from "@/entities/link";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

export function CreateLinkFormFields({
  control,
}: {
  control: Control<z.infer<typeof LINK_SCHEMA>>;
}) {
  const tcAdapter = useTwinClassSelectAdapter();
  const typeAdapter = useLinkTypeSelectAdapter();
  const strengthAdapter = useLinkStrengthSelectAdapter();

  const srcTwinClassId = useWatch({ name: "srcTwinClassId", control });
  const dstTwinClassId = useWatch({ name: "dstTwinClassId", control });

  return (
    <>
      <ComboboxFormField
        control={control}
        name="srcTwinClassId"
        label="Source Twin Class"
        disabled={isPopulatedString(srcTwinClassId)}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
      />

      <ComboboxFormField
        control={control}
        name="dstTwinClassId"
        label="Destination Twin Class"
        disabled={isPopulatedString(dstTwinClassId)}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
      />

      <TextFormField control={control} name="name" label="Link Name" />

      <ComboboxFormField
        control={control}
        name="type"
        label="Link Type"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...typeAdapter}
      />

      <ComboboxFormField
        control={control}
        name="linkStrength"
        label="Link Strength"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...strengthAdapter}
      />
    </>
  );
}
