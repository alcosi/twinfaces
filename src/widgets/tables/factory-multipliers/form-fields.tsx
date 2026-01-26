import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
} from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { FACTORY_MULTIPLIER_SCHEMA } from "@/entities/factory-multiplier";
import { FeaturerTypes } from "@/entities/featurer";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isPopulatedString, isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function FactoryMultiplierFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>>;
}) {
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const factoryWatch = useWatch({ control, name: "factoryId" });
  const disabled = useRef(isTruthy(factoryWatch)).current;
  const twinClassWatch = useWatch({
    control,
    name: "inputTwinClassId",
  });

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Input class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(twinClassWatch),
  };

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

      <ComplexComboboxFormField
        control={control}
        name="inputTwinClassId"
        info={twinClassInfo}
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
