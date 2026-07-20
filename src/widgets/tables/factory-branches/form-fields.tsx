import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { SwitchFormField, TextAreaFormField } from "@/components/form-fields";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import { FACTORY_BRANCH_SCHEMA } from "@/entities/factory-branch";
import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import { isTruthy } from "@/shared/libs";

export function FactoryBranchFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_BRANCH_SCHEMA>>;
}) {
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const nextFactoryAdapter = useFactorySelectAdapterWithFilters();
  const factoryWatch = useWatch({ control, name: "factoryId" });
  const disabled = useRef(isTruthy(factoryWatch)).current;

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const factoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Factory",
    adapter: factoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: disabled,
  };

  const factoryConditionSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Condition set",
    adapter: factoryConditionSetAdapter,
    extraFilters: buildFactoryConditionSetFilters(),
    mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  const nextFactoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Next factory",
    adapter: nextFactoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="factoryId"
        info={factoryInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="factoryConditionSetId"
        info={factoryConditionSetInfo}
      />

      <SwitchFormField
        control={control}
        name="factoryConditionSetInvert"
        label="Condition set invert"
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <SwitchFormField control={control} name="active" label="Active" />

      <ComplexComboboxFormField
        control={control}
        name="nextFactoryId"
        info={nextFactoryInfo}
      />
    </>
  );
}
