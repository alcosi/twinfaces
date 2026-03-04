import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { useDatalistOptionSelectAdapter } from "@/entities/datalist-option/index";
import {
  TWIN_CLASS_DYNAMIC_MARKER_SCHEMA,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useValidatorSetSelectAdapter } from "@/entities/validator-set";
import { isTruthy } from "@/shared/libs";

export function TwinClassDynamicMarkerFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_CLASS_DYNAMIC_MARKER_SCHEMA>>;
}) {
  const twinClassAdapter = useTwinClassSelectAdapter();
  const validatorSetAdapter = useValidatorSetSelectAdapter();
  const markerAdapter = useDatalistOptionSelectAdapter();
  const twinClassWatch = useWatch({ control, name: "twinClassId" });
  const disabled = useRef(isTruthy(twinClassWatch)).current;

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabled}
        required
        {...twinClassAdapter}
      />

      <ComboboxFormField
        control={control}
        name="twinValidatorSetId"
        label="Validator Set"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        required
        {...validatorSetAdapter}
      />

      <ComboboxFormField
        control={control}
        name="markerDataListOptionId"
        label="Marker option"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        required
        {...markerAdapter}
      />
    </>
  );
}
