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
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const nextFactoryAdapter = useFactorySelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();
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

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();

  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const factoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Factory",
    adapter: factoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: disabledFactory,
  };

  const factoryConditionSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Condition set",
    adapter: factoryConditionSetAdapter,
    extraFilters: buildFactoryConditionSetFilters(),
    mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  const nextFactoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Next factory",
    adapter: nextFactoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
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

      <ComplexComboboxFormField
        control={control}
        name="factoryConditionSetId"
        info={factoryConditionSetInfo}
      />

      <SwitchFormField
        control={control}
        name="factoryConditionSetInvert"
        label="Condition set invert"
      />

      <SwitchFormField control={control} name="active" label="Active" />

      <ComplexComboboxFormField
        control={control}
        name="outputStatusId"
        info={outputTwinStatusInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="nextFactoryId"
        info={nextFactoryInfo}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
