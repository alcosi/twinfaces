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
import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import { FACTORY_TRIGGER_SCHEMA } from "@/entities/factory-trigger";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useTwinTriggerFilters,
  useTwinTriggerSelectAdapterWithFilters,
} from "@/entities/twin-trigger";
import { isTruthy } from "@/shared/libs";

type TriggersFormValues = z.infer<typeof FACTORY_TRIGGER_SCHEMA>;

export function TriggersFormFields({
  control,
}: {
  control: Control<TriggersFormValues>;
}) {
  const twinTriggerAdapter = useTwinTriggerSelectAdapterWithFilters();
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();
  const {
    buildFilterFields: buildTwinTriggerFilters,
    mapFiltersToPayload: mapTwinTriggerFilters,
  } = useTwinTriggerFilters({});
  const twinTriggerWatch = useWatch({ control, name: "twinTriggerId" });
  const disabled = useRef(isTruthy(twinTriggerWatch)).current;

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Input twin class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  const twinFactoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin factory",
    adapter: factoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  const twinFactoryConditionSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin factory condition set",
    adapter: factoryConditionSetAdapter,
    extraFilters: buildFactoryConditionSetFilters(),
    mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select transition...",
    multi: false,
  };

  const twinTriggerInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin trigger",
    adapter: twinTriggerAdapter,
    extraFilters: buildTwinTriggerFilters(),
    mapExtraFilters: (filters) => mapTwinTriggerFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin trigger...",
    multi: false,
    disabled: disabled,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinFactoryId"
        info={twinFactoryInfo}
        required
      />
      <ComplexComboboxFormField
        control={control}
        name="inputTwinClassId"
        info={twinClassInfo}
        required
      />
      <ComplexComboboxFormField
        control={control}
        name="twinFactoryConditionSetId"
        info={twinFactoryConditionSetInfo}
        required
      />
      <SwitchFormField
        control={control}
        name="twinFactoryConditionInvert"
        label="Twin factory condition invert"
      />
      <SwitchFormField control={control} name="active" label="Active" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
      <ComplexComboboxFormField
        control={control}
        name="twinTriggerId"
        info={twinTriggerInfo}
        required
      />
      <SwitchFormField control={control} name="async" label="Async" />
    </>
  );
}
