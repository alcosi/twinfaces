import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { useFactoryPipelineSelectAdapter } from "@/entities/factory-pipeline";
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
  const factoryPipelineAdapter = useFactoryPipelineSelectAdapter(factoryId);
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const factoryPipelineWatch = useWatch({ control, name: "factoryPipelineId" });
  const disabled = useRef(isTruthy(factoryPipelineWatch)).current;

  return (
    <>
      <ComboboxFormField
        control={control}
        name="factoryPipelineId"
        label="Pipeline"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabled}
        {...factoryPipelineAdapter}
      />

      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />

      <ComboboxFormField
        control={control}
        name="factoryConditionSetId"
        label="Condition set"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryConditionSetAdapter}
      />

      <CheckboxFormField
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

      <CheckboxFormField control={control} name="optional" label="Optional" />

      <CheckboxFormField control={control} name="active" label="Active" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
