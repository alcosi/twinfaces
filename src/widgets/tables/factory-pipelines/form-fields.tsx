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
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { FACTORY_PIPELINE_SCHEMA } from "@/entities/factory-pipeline";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
import {
  isFalsy,
  isPopulatedString,
  isTruthy,
  reduceToObject,
  toArray,
} from "@/shared/libs";

export function FactoryPipelineFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_PIPELINE_SCHEMA>>;
}) {
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const factoryWatch = useWatch({ control, name: "factoryId" });
  const twinClassWatch = useWatch({
    control,
    name: "inputTwinClassId",
  }) as unknown as { id: string }[];

  const twinStatusAdapter = useTwinStatusSelectAdapterWithFilters();

  const disabledFactory = useRef(isTruthy(factoryWatch)).current;
  const disabledOutputStatus = isFalsy(twinClassWatch[0]?.id);

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
    label: "Input class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(twinClassWatch),
  };

  const outputTwinStatusInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Output status",
    adapter: twinStatusAdapter,
    extraFilters: buildTwinStatusFilters(),
    mapExtraFilters: (filters) => ({
      ...mapTwinStatusFilters(filters),
      twinClassIdMap: reduceToObject({
        list: toArray(twinClassWatch?.[0]),
        defaultValue: true,
      }),
    }),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select output status",
    multi: false,
    disabled: disabledOutputStatus,
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
        disabled={disabledFactory}
        {...factoryAdapter}
      />

      <ComplexComboboxFormField
        control={control}
        name="inputTwinClassId"
        info={twinClassInfo}
      />

      <ComboboxFormField
        control={control}
        name="factoryConditionSetId"
        label="Condition set"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryConditionSetAdapter}
      />

      <CheckboxFormField
        control={control}
        name="factoryConditionSetInvert"
        label="Condition set invert"
      />

      <CheckboxFormField control={control} name="active" label="Active" />

      <ComplexComboboxFormField
        control={control}
        name="outputStatusId"
        info={outputTwinStatusInfo}
      />

      <ComboboxFormField
        control={control}
        name="nextFactoryId"
        label="Next factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryAdapter}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
