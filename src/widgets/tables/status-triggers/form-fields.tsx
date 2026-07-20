import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { SwitchFormField, TextFormField } from "@/components/form-fields";

import { STATUS_TRIGGER_SCHEMA } from "@/entities/status-trigger";
import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
import {
  useTwinTriggerFilters,
  useTwinTriggerSelectAdapterWithFilters,
} from "@/entities/twin-trigger";
import { isTruthy } from "@/shared/libs";

type TriggersFormValues = z.infer<typeof STATUS_TRIGGER_SCHEMA>;

export function StatusTriggerFormFields({
  control,
}: {
  control: Control<TriggersFormValues>;
}) {
  const twinStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const twinTriggerAdapter = useTwinTriggerSelectAdapterWithFilters();
  const twinTriggerWatch = useWatch({ control, name: "twinTriggerId" });
  const disabled = useRef(isTruthy(twinTriggerWatch)).current;
  const statusWatch = useWatch({ control, name: "twinStatusId" });
  const disabledStatus = useRef(isTruthy(statusWatch)).current;

  const {
    buildFilterFields: buildTwinStatusFilters,
    mapFiltersToPayload: mapTwinStatusFilters,
  } = useStatusFilters({});

  const {
    buildFilterFields: buildTwinTriggerFilters,
    mapFiltersToPayload: mapTwinTriggerFilters,
  } = useTwinTriggerFilters({});

  const twinStatusInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin status",
    adapter: twinStatusAdapter,
    extraFilters: buildTwinStatusFilters(),
    mapExtraFilters: (filters) => mapTwinStatusFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin status...",
    multi: false,
    disabled: disabledStatus,
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
        name="twinStatusId"
        info={twinStatusInfo}
        required
      />
      <SwitchFormField
        control={control}
        name="incomingElseOutgoing"
        label="Incoming else outgoint"
      />
      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
      <ComplexComboboxFormField
        control={control}
        name="twinTriggerId"
        info={twinTriggerInfo}
        required
      />
      <SwitchFormField control={control} name="async" label="Async" />
      <SwitchFormField control={control} name="active" label="Active" />
    </>
  );
}
