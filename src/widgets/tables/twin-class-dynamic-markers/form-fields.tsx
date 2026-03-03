import { Control } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { useDatalistOptionSelectAdapter } from "@/entities/datalist-option/index";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useValidatorSetSelectAdapter } from "@/entities/validator-set";

import { TWIN_CLASS_DYNAMIC_MARKER_SCHEMA } from "./constants";

export function TwinClassDynamicMarkerFormFields({
  control,
  twinClassId,
}: {
  control: Control<z.infer<typeof TWIN_CLASS_DYNAMIC_MARKER_SCHEMA>>;
  twinClassId?: string;
}) {
  const twinClassAdapter = useTwinClassSelectAdapter();
  const validatorSetAdapter = useValidatorSetSelectAdapter();
  const markerAdapter = useDatalistOptionSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={!!twinClassId}
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
