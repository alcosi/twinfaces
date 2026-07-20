import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { SwitchFormField, TextFormField } from "@/components/form-fields";

import { TRANSITION_TRIGGER_SCHEMA } from "@/entities/transition-trigger";
import {
  useTransitionSelectAdapterWithFilters,
  useTwinFlowTransitionFilters,
} from "@/entities/twin-flow-transition";
import {
  useTwinTriggerFilters,
  useTwinTriggerSelectAdapterWithFilters,
} from "@/entities/twin-trigger";
import { isTruthy } from "@/shared/libs";

type TriggersFormValues = z.infer<typeof TRANSITION_TRIGGER_SCHEMA>;

export function TriggersFormFields({
  control,
  transitionId,
}: {
  control: Control<TriggersFormValues>;
  transitionId?: string;
}) {
  const twinTriggerAdapter = useTwinTriggerSelectAdapterWithFilters();
  const twinTriggerWatch = useWatch({ control, name: "twinTriggerId" });
  const disabledTwinTrigger = useRef(isTruthy(twinTriggerWatch)).current;
  const transitionAdapter = useTransitionSelectAdapterWithFilters();
  const disabled = useRef(isTruthy(transitionId)).current;

  const {
    buildFilterFields: buildTwinFlowTransitionFilters,
    mapFiltersToPayload: mapTwinFlowTransitionFilters,
  } = useTwinFlowTransitionFilters({});

  const {
    buildFilterFields: buildTwinTriggerFilters,
    mapFiltersToPayload: mapTwinTriggerFilters,
  } = useTwinTriggerFilters({});

  const transitionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Transition",
    adapter: transitionAdapter,
    extraFilters: buildTwinFlowTransitionFilters(),
    mapExtraFilters: (filters) => mapTwinFlowTransitionFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select transition...",
    multi: false,
    disabled: disabled,
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
    disabled: disabledTwinTrigger,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinflowTransitionId"
        info={transitionInfo}
        required
      />
      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
      <SwitchFormField control={control} name="active" label="Active" />
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
