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
import { FeaturerFormField } from "@/widgets/form-fields";

export function FactoryMultiplierFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>>;
}) {
  const fAdapter = useFactorySelectAdapter();
  const tcAdapter = useTwinClassSelectAdapter();
  const fWatch = useWatch({ control, name: "factoryId" });
  const disabled = useRef(isTruthy(fWatch)).current;

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
        autoFocus={true}
        {...fAdapter}
      />

      <ComboboxFormField
        control={control}
        name="inputTwinClassId"
        label="Input class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...tcAdapter}
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
