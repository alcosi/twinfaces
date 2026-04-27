import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  ComboboxFormField,
  SwitchFormField,
  TextAreaFormField,
} from "@/components/form-fields";

import { FACTORY_CONDITION_SCHEMA } from "@/entities/factory-condition";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function FactoryConditionFormFields({
  control,
  factoryConditionSetId,
}: {
  control: Control<z.infer<typeof FACTORY_CONDITION_SCHEMA>>;
  factoryConditionSetId?: string;
}) {
  const conditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const conditionSetWatch = useWatch({
    control,
    name: "factoryConditionSetId",
  });
  const disabled = useRef(
    isTruthy(factoryConditionSetId || conditionSetWatch)
  ).current;

  return (
    <>
      <ComboboxFormField
        control={control}
        name="factoryConditionSetId"
        label="Condition Set"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabled}
        {...conditionSetAdapter}
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
