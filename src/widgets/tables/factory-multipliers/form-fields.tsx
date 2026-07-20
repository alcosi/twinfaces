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
import { FACTORY_MULTIPLIER_SCHEMA } from "@/entities/factory-multiplier";
import { FeaturerTypes } from "@/entities/featurer";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function FactoryMultiplierFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>>;
}) {
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const factoryWatch = useWatch({ control, name: "factoryId" });
  const disabled = useRef(isTruthy(factoryWatch)).current;

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

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

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Input class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
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

      <SwitchFormField control={control} name="active" label="Active" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
