import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { TWIN_FLOW_SCHEMA } from "@/entities/twin-flow";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";

export function TwinClassTwinFlowFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_FLOW_SCHEMA>>;
}) {
  const twinClassIdWatch = useWatch({ control, name: "twinClassId" });
  const disabled = useRef(isTruthy(twinClassIdWatch)).current;
  const twinStatusAdapter = useTwinStatusSelectAdapter();

  const tcAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const complexComboboxInfo: AutoFormComplexComboboxValueInfo = {
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

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={complexComboboxInfo}
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

      <ComboboxFormField
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
      />
    </>
  );
}
