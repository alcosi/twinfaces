import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";

import {
  useDatalistOptionFilters,
  useDatalistOptionSelectAdapterWithFilters,
} from "@/entities/datalist-option";
import {
  TWIN_CLASS_DYNAMIC_MARKER_SCHEMA,
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useValidatorSetFilters,
  useValidatorSetSelectAdapterWithFilters,
} from "@/entities/validator-set";
import { isTruthy } from "@/shared/libs";

export function TwinClassDynamicMarkerFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_CLASS_DYNAMIC_MARKER_SCHEMA>>;
}) {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const validatorSetAdapter = useValidatorSetSelectAdapterWithFilters();
  const markerAdapter = useDatalistOptionSelectAdapterWithFilters();
  const twinClassWatch = useWatch({ control, name: "twinClassId" });
  const disabled = useRef(isTruthy(twinClassWatch)).current;

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const {
    buildFilterFields: buildValidatorSetFilters,
    mapFiltersToPayload: mapValidatorSetFilters,
  } = useValidatorSetFilters();

  const {
    buildFilterFields: buildDatalistOptionFilters,
    mapFiltersToPayload: mapDatalistOptionFilters,
  } = useDatalistOptionFilters({});

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled,
  };

  const validatorSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Validator Set",
    adapter: validatorSetAdapter,
    extraFilters: buildValidatorSetFilters(),
    mapExtraFilters: (filters) => mapValidatorSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  const markerInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Marker option",
    adapter: markerAdapter,
    extraFilters: buildDatalistOptionFilters(),
    mapExtraFilters: (filters) => mapDatalistOptionFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={twinClassInfo}
        required
      />

      <ComplexComboboxFormField
        control={control}
        name="twinValidatorSetId"
        info={validatorSetInfo}
        required
      />

      <ComplexComboboxFormField
        control={control}
        name="markerDataListOptionId"
        info={markerInfo}
        required
      />
    </>
  );
}
