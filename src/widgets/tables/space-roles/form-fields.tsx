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

import { useBusinessAccountSelectAdapter } from "@/entities/business-account";
import { SPACE_ROLE_SHEMA } from "@/entities/space-role";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isTruthy } from "@/shared/libs";

export function SpaceRolesFormFields({
  control,
}: {
  control: Control<z.infer<typeof SPACE_ROLE_SHEMA>>;
}) {
  const businessAccountAdapter = useBusinessAccountSelectAdapter();
  const tcAdapter = useTwinClassSelectAdapterWithFilters();
  const twinClassWatch = useWatch({ control, name: "twinClassId" });
  const disabled = useRef(isTruthy(twinClassWatch)).current;

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
    disabled: disabled,
  };

  return (
    <>
      <TextFormField control={control} name="key" label="Key" />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={twinClassInfo}
      />

      <ComboboxFormField
        control={control}
        name="businessAccountId"
        label="Business account"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...businessAccountAdapter}
      />
    </>
  );
}
