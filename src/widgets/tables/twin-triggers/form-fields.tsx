import { Control } from "react-hook-form";
import z from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { TextAreaFormField, TextFormField } from "@/components/form-fields";
import { SwitchFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { TWIN_TRIGGER_SCHEMA } from "@/entities/twin-trigger";

import { FeaturerFormField } from "../../form-fields";

export function TwinTriggerFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWIN_TRIGGER_SCHEMA>>;
}) {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const jobClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Job class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select job class",
    multi: false,
  };

  return (
    <>
      <FeaturerFormField
        typeId={FeaturerTypes.trigger}
        control={control}
        label="Twin trigger featurer"
        name="triggerFeaturerId"
        paramsFieldName="triggerParams"
      />

      <ComplexComboboxFormField
        control={control}
        name="jobTwinClassId"
        info={jobClassInfo}
      />

      <SwitchFormField control={control} name="active" label="Active" />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
    </>
  );
}
