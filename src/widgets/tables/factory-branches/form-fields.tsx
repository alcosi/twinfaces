import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
} from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { FACTORY_BRANCH_SCHEMA } from "@/entities/factory-branch";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { isTruthy } from "@/shared/libs";

export function FactoryBranchFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_BRANCH_SCHEMA>>;
}) {
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const factoryWatch = useWatch({ control, name: "factoryId" });
  const disabled = useRef(isTruthy(factoryWatch)).current;

  return (
    <>
      <ComboboxFormField
        control={control}
        name="factoryId"
        label="Factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabled}
        {...factoryAdapter}
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

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <CheckboxFormField control={control} name="active" label="Active" />

      <ComboboxFormField
        control={control}
        name="nextFactoryId"
        label="Next factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryAdapter}
      />
    </>
  );
}
