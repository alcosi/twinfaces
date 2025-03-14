import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
} from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { FACTORY_PIPELINE_SCHEMA } from "@/entities/factory-pipeline";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { isFalsy, isTruthy } from "@/shared/libs";

export function FactoryPipelineFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_PIPELINE_SCHEMA>>;
}) {
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const factoryWatch = useWatch({ control, name: "factoryId" });
  const twinClassWatch = useWatch({
    control,
    name: "inputTwinClassId",
  }) as unknown as { id: string }[];

  const twinStatusAdapter = useTwinStatusSelectAdapter(twinClassWatch[0]?.id);

  const disabledFactory = useRef(isTruthy(factoryWatch)).current;
  const disabledOutputStatus = isFalsy(twinClassWatch[0]?.id);

  return (
    <>
      <ComboboxFormField
        control={control}
        name="factoryId"
        label="Factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabledFactory}
        {...factoryAdapter}
      />

      <ComboboxFormField
        control={control}
        name="inputTwinClassId"
        label="Input class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassAdapter}
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
        label="Condition set invert"
      />

      <CheckboxFormField control={control} name="active" label="Active" />

      <ComboboxFormField
        control={control}
        name="outputStatusId"
        label="Output status"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabledOutputStatus}
        {...twinStatusAdapter}
      />

      <ComboboxFormField
        control={control}
        name="nextFactoryId"
        label="Next factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryAdapter}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
