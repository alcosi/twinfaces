import { Control } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { useDatalistOptionSelectAdapter } from "@/entities/datalist-option";
import { OPTION_PROJECTION_SHEMA } from "@/entities/option-projection";
import { useProjectionTypeSelectAdapter } from "@/entities/projection/libs";

export function OptionsProjectionFormFields({
  control,
}: {
  control: Control<z.infer<typeof OPTION_PROJECTION_SHEMA>>;
}) {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const dataListOptionAdapter = useDatalistOptionSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="projectionTypeId"
        label="Type"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...projectionTypeAdapter}
      />

      <ComboboxFormField
        control={control}
        name="srcDataListOptionId"
        label="Src option"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...dataListOptionAdapter}
      />

      <ComboboxFormField
        control={control}
        name="dstDataListOptionId"
        label="Dst option"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...dataListOptionAdapter}
      />
    </>
  );
}
