import { Control, useWatch } from "react-hook-form";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  ColorPickerFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { TwinClassStatusFormValues } from "@/entities/twin-status";
import { isPopulatedString } from "@/shared/libs";

export function TwinClassStatusFormFields({
  control,
}: {
  control: Control<TwinClassStatusFormValues>;
}) {
  const twinClassId = useWatch({ control, name: "twinClassId" });
  const tcAdapter = useTwinClassSelectAdapterWithFilters();

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
    disabled: isPopulatedString(twinClassId),
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={twinClassInfo}
      />

      <TextFormField
        control={control}
        name="key"
        label="Key"
        autoFocus={true}
      />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      {/*<TextFormField control={control} name="logo" label="Logo URL" />*/}

      <ColorPickerFormField
        control={control}
        name="backgroundColor"
        label="Background color"
      />

      <ColorPickerFormField
        control={control}
        name="fontColor"
        label="Font color"
      />
    </>
  );
}
