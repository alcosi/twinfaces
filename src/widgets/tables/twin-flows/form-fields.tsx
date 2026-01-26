import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { TWIN_FLOW_SCHEMA } from "@/entities/twin-flow";
import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
import { isFalsy, isTruthy, reduceToObject, toArray } from "@/shared/libs";

export function TwinClassTwinFlowFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_FLOW_SCHEMA>>;
}) {
  const twinClassIdWatch = useWatch({ control, name: "twinClassId" });
  const disabled = useRef(isTruthy(twinClassIdWatch)).current;
  const twinStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const tcAdapter = useTwinClassSelectAdapterWithFilters();

  const disabledStatus = isFalsy(twinClassIdWatch);

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const {
    buildFilterFields: buildTwinStatusFilters,
    mapFiltersToPayload: mapTwinStatusFilters,
  } = useStatusFilters({});

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Class",
    adapter: tcAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: disabled,
  };

  const initialTwinStatusInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Initial statuss",
    adapter: twinStatusAdapter,
    extraFilters: buildTwinStatusFilters(),
    mapExtraFilters: (filters) => ({
      ...mapTwinStatusFilters(filters),
      twinClassIdMap: reduceToObject({
        list: toArray(twinClassIdWatch),
        defaultValue: true,
      }),
    }),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select initial status",
    multi: false,
    disabled: disabledStatus,
  };

  return (
    <>
      <ComplexComboboxFormField
        required={true}
        control={control}
        name="twinClassId"
        info={twinClassInfo}
      />

      <TextFormField
        control={control}
        name="name"
        label="Name"
        autoFocus={true}
        required={true}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <ComplexComboboxFormField
        required={true}
        control={control}
        name="initialStatus"
        info={initialTwinStatusInfo}
      />

      {/* <ComboboxFormField
        control={control}
        name="initialStatus"
        label="Initial status"
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText="No status found"
        required={true}
        {...twinStatusAdapter}
        getItems={async (search: string) => {
          return twinStatusAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(twinClassIdWatch),
              defaultValue: true,
            }),
          });
        }}
      /> */}
    </>
  );
}
