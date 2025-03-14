import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
} from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { FACTORY_MULTIPLIER_SCHEMA } from "@/entities/factory-multiplier";
import { FeaturerTypes } from "@/entities/featurer";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function FactoryMultiplierFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>>;
}) {
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
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
        name="inputTwinClassId"
        label="Input class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassAdapter}
      />

      <FeaturerFormField
        typeId={FeaturerTypes.multiplier}
        control={control}
        label="Multiplier"
        name="multiplierFeaturerId"
        paramsFieldName="multiplierParams"
      />

      <CheckboxFormField control={control} name="active" label="Active" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
