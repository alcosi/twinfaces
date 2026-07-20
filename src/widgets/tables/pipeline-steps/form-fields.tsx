import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  SwitchFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import {
  useFactoryPipelineFilters,
  useFactoryPipelineSelectAdapterWithFilters,
} from "@/entities/factory-pipeline";
import { PIPELINE_STEP_SCHEMA } from "@/entities/factory-pipeline-step";
import { FeaturerTypes } from "@/entities/featurer";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function PipelineStepFormFields({
  control,
  factoryId,
}: {
  control: Control<z.infer<typeof PIPELINE_STEP_SCHEMA>>;
  factoryId?: string;
}) {
  const factoryPipelineAdapter =
    useFactoryPipelineSelectAdapterWithFilters(factoryId);
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();
  const factoryPipelineWatch = useWatch({ control, name: "factoryPipelineId" });
  const disabled = useRef(isTruthy(factoryPipelineWatch)).current;

  const {
    buildFilterFields: buildFactoryPipelineFilters,
    mapFiltersToPayload: mapFactoryPipelineFilters,
  } = useFactoryPipelineFilters({});

  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const factoryPipelineInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Pipeline",
    adapter: factoryPipelineAdapter,
    extraFilters: buildFactoryPipelineFilters(),
    mapExtraFilters: (filters) => mapFactoryPipelineFilters(filters),
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

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="factoryPipelineId"
        info={factoryPipelineInfo}
      />

      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />

      <ComplexComboboxFormField
        control={control}
        name="factoryConditionSetId"
        info={factoryConditionSetInfo}
      />

      <SwitchFormField
        control={control}
        name="factoryConditionSetInvert"
        label="Condition invert"
      />

      <FeaturerFormField
        typeId={FeaturerTypes.filler}
        control={control}
        label="Filler"
        name="fillerFeaturerId"
        paramsFieldName="fillerParams"
      />

      <SwitchFormField control={control} name="optional" label="Optional" />

      <SwitchFormField control={control} name="active" label="Active" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
