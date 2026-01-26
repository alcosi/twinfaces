import { Control } from "react-hook-form";

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

import { TwinFormValues, useTwinClassFields } from "@/entities/twin";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";

import { TwinFieldFormField } from "../../form-fields";

export function TwinFormFields({
  control,
  baseTwinClassId,
}: {
  control: Control<TwinFormValues>;
  baseTwinClassId?: string;
}) {
  const {
    selectedTwinClass,
    fields,
    userAdapter,
    hasHeadClass,
    headAdapter,
    hasTagDataList,
    optionAdapter,
  } = useTwinClassFields(control, { baseTwinClassId });

  const tcAdapter = useTwinClassSelectAdapterWithFilters(
    {
      baseTwinClassId,
    },
    true
  );

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Class",
    adapter: tcAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(baseTwinClassId),
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="classId"
        info={twinClassInfo}
      />

      {hasHeadClass && (
        <ComboboxFormField
          name="headTwinId"
          control={control}
          label="Head"
          {...headAdapter}
          required
        />
      )}

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <ComboboxFormField
        name="assignerUserId"
        control={control}
        label="Assignee"
        {...userAdapter}
      />

      {fields.map((field) => (
        <TwinFieldFormField
          key={field.key}
          name={`fields.${field.key!}`}
          control={control}
          label={field.name}
          twinClassId={selectedTwinClass!.id}
          descriptor={field.descriptor}
          required={field.required}
        />
      ))}

      {hasTagDataList && (
        <ComboboxFormField
          control={control}
          name="tags"
          label="Tags"
          multi
          creatable
          {...optionAdapter}
        />
      )}
    </>
  );
}
