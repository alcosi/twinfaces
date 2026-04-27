import { Control } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  ComboboxFormField,
  SwitchFormField,
  TextAreaFormField,
} from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { FACTORY_TRIGGER_SCHEMA } from "@/entities/factory-trigger";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";

type TriggersFormValues = z.infer<typeof FACTORY_TRIGGER_SCHEMA>;

export function TriggersFormFields({
  control,
}: {
  control: Control<TriggersFormValues>;
}) {
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

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

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinFactoryId"
        label="Twin factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryAdapter}
        required
      />
      <ComplexComboboxFormField
        control={control}
        name="inputTwinClassId"
        info={twinClassInfo}
        required
      />
      <ComboboxFormField
        control={control}
        name="twinFactoryConditionSetId"
        label="Twin factory condition set"
        searchPlaceholder="Search..."
        selectPlaceholder="Select transition..."
        noItemsText="No data found"
        {...factoryConditionSetAdapter}
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
      <ComboboxFormField
        control={control}
        name="twinTriggerId"
        label="Twin trigger"
        searchPlaceholder="Search..."
        selectPlaceholder="Select twin trigger..."
        noItemsText="No data found"
        {...twinTriggerAdapter}
        required
      />
      <SwitchFormField control={control} name="async" label="Async" />
    </>
  );
}
