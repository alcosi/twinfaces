import { Control } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { ComboboxFormField } from "@/components/form-fields";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  useTwinFlowFilters,
  useTwinFlowSelectAdapterWithFilters,
} from "@/entities/twin-flow";
import {
  TWINFLOW_FACTORY_SCHEMA,
  useFactoryLauncherSelectAdapter,
} from "@/entities/twinflow-factory";
import { isTruthy } from "@/shared/libs";

export function TwinFlowFactoryFormFields({
  control,
  twinflowId,
}: {
  control: Control<z.infer<typeof TWINFLOW_FACTORY_SCHEMA>>;
  twinflowId?: string;
}) {
  const twinflowAdapter = useTwinFlowSelectAdapterWithFilters();
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const launcherAdapter = useFactoryLauncherSelectAdapter();

  const {
    buildFilterFields: buildTwinFlowFilters,
    mapFiltersToPayload: mapTwinFlowFilters,
  } = useTwinFlowFilters({});

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();

  const twinflowDisabled = isTruthy(twinflowId);

  const twinflowInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twinflow",
    adapter: twinflowAdapter,
    extraFilters: buildTwinFlowFilters(),
    mapExtraFilters: (filters) => mapTwinFlowFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: twinflowDisabled,
  };

  const factoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Factory",
    adapter: factoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinflowId"
        info={twinflowInfo}
      />

      <ComboboxFormField
        control={control}
        name="twinFactoryLauncherId"
        label="Launcher"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...launcherAdapter}
      />

      <ComplexComboboxFormField
        control={control}
        name="factoryId"
        info={factoryInfo}
      />
    </>
  );
}
