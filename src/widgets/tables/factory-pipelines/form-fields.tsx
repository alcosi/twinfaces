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
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
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

  const twinStatusAdapter = useTwinStatusSelectAdapter();

  const disabledFactory = useRef(isTruthy(factoryWatch)).current;
  const disabledOutputStatus = isFalsy(twinClassWatch[0]?.id);

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const complexComboboxInfo: AutoFormComplexComboboxValueInfo = {
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
        disabled={disabledFactory}
        {...factoryAdapter}
      />

      <ComplexComboboxFormField
        control={control}
        name="inputTwinClassId"
        info={complexComboboxInfo}
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

      <ComboboxFormField
        control={control}
        name="outputStatusId"
        label="Output status"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabledOutputStatus}
        {...twinStatusAdapter}
        getItems={async (search: string) => {
          return twinStatusAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(twinClassWatch[0]?.id),
              defaultValue: true,
            }),
          });
        }}
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
