import { Control } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { ComboboxFormField } from "@/components/form-fields";

import {
  useDatalistOptionFilters,
  useDatalistOptionSelectAdapterWithFilters,
} from "@/entities/datalist-option";
import {
  OPTION_PROJECTION_SHEMA,
  TitleOptionProjections,
} from "@/entities/option-projection";
import { useProjectionTypeSelectAdapter } from "@/entities/projection/libs";

export function OptionsProjectionFormFields({
  control,
  title,
}: {
  control: Control<z.infer<typeof OPTION_PROJECTION_SHEMA>>;
  title?: TitleOptionProjections;
}) {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const srcDataListOptionAdapter = useDatalistOptionSelectAdapterWithFilters();
  const dstDataListOptionAdapter = useDatalistOptionSelectAdapterWithFilters();

  const {
    buildFilterFields: buildDatalistOptionFilters,
    mapFiltersToPayload: mapDatalistOptionFilters,
  } = useDatalistOptionFilters({});

  const srcDataListOptionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Src option",
    adapter: srcDataListOptionAdapter,
    extraFilters: buildDatalistOptionFilters(),
    mapExtraFilters: (filters) => mapDatalistOptionFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: title === "Outgoing",
  };

  const dstDataListOptionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Dst option",
    adapter: dstDataListOptionAdapter,
    extraFilters: buildDatalistOptionFilters(),
    mapExtraFilters: (filters) => mapDatalistOptionFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: title === "Incoming",
  };

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

      <ComplexComboboxFormField
        control={control}
        name="srcDataListOptionId"
        info={srcDataListOptionInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="dstDataListOptionId"
        info={dstDataListOptionInfo}
      />
    </>
  );
}
