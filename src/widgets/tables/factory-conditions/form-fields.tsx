import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { SwitchFormField, TextAreaFormField } from "@/components/form-fields";

import { FACTORY_CONDITION_SCHEMA } from "@/entities/factory-condition";
import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function FactoryConditionFormFields({
  control,
  factoryConditionSetId,
}: {
  control: Control<z.infer<typeof FACTORY_CONDITION_SCHEMA>>;
  factoryConditionSetId?: string;
}) {
  const conditionSetAdapter = useFactoryConditionSetSelectAdapterWithFilters();
  const conditionSetWatch = useWatch({
    control,
    name: "factoryConditionSetId",
  });
  const disabled = useRef(
    isTruthy(factoryConditionSetId || conditionSetWatch)
  ).current;

  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const conditionSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Condition Set",
    adapter: conditionSetAdapter,
    extraFilters: buildFactoryConditionSetFilters(),
    mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: disabled,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="factoryConditionSetId"
        info={conditionSetInfo}
      />

      <FeaturerFormField
        typeId={24}
        control={control}
        label="Condition featurer"
        name="conditionerFeatureId"
        paramsFieldName="conditionerParams"
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <SwitchFormField control={control} name="active" label="Active" />

      <SwitchFormField control={control} name="invert" label="Invert" />
    </>
  );
}
