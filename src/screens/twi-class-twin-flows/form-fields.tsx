import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { TWIN_FLOW_SCHEMA } from "@/entities/twin-flow";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { isPopulatedString } from "@/shared/libs";

export function TwinClassTwinFlowFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_FLOW_SCHEMA>>;
}) {
  const twinClassId = useWatch({ control, name: "twinClassId" });
  const twinStatusAdapter = useTwinStatusSelectAdapter(twinClassId!);
  const twinClassAdapter = useTwinClassSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Class"
        disabled={isPopulatedString(twinClassId)}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...twinClassAdapter}
      />

      <TextFormField
        control={control}
        name="name"
        label="Name"
        autoFocus={true}
        required={true}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <ComboboxFormField
        control={control}
        name="initialStatus"
        label="Initial status"
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText="No status found"
        required={true}
        {...twinStatusAdapter}
      />
    </>
  );
}
