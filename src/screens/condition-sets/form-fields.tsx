import { Control } from "react-hook-form";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import { ConditionSetFieldValues } from "@/entities/factory-condition-set";

export function ConditionSetFields({
  control,
}: {
  control: Control<ConditionSetFieldValues>;
}) {
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();

  const factoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Factory",
    adapter: factoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  return (
    <>
      <TextFormField control={control} name="name" label="Name" />

      <ComplexComboboxFormField
        control={control}
        name="twinFactoryId"
        info={factoryInfo}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
