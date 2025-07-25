import { useRef } from "react";
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
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";

export function TwinClassTwinFlowFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_FLOW_SCHEMA>>;
}) {
  const twinClassIdWatch = useWatch({ control, name: "twinClassId" });
  const disabled = useRef(isTruthy(twinClassIdWatch)).current;
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Class"
        disabled={disabled}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText="No classes found"
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
        getItems={async (search: string) => {
          return twinStatusAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(twinClassIdWatch),
              defaultValue: true,
            }),
          });
        }}
      />
    </>
  );
}
