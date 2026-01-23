import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import {
  LINK_SCHEMA,
  useLinkStrengthSelectAdapter,
  useLinkTypeSelectAdapter,
} from "@/entities/link";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";

export function CreateLinkFormFields({
  control,
}: {
  control: Control<z.infer<typeof LINK_SCHEMA>>;
}) {
  const tcsAdapter = useTwinClassSelectAdapterWithFilters();
  const tcdAdapter = useTwinClassSelectAdapterWithFilters();
  const typeAdapter = useLinkTypeSelectAdapter();
  const strengthAdapter = useLinkStrengthSelectAdapter();

  const srcTwinClassId = useWatch({ name: "srcTwinClassId", control });
  const dstTwinClassId = useWatch({ name: "dstTwinClassId", control });

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const complexComboboxSrcInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Source Twin Class",
    adapter: tcsAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(srcTwinClassId),
  };

  const complexComboboxDstInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Destination Twin Class",
    adapter: tcdAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(dstTwinClassId),
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="srcTwinClassId"
        info={complexComboboxSrcInfo}
      />
      <ComplexComboboxFormField
        control={control}
        name="dstTwinClassId"
        info={complexComboboxDstInfo}
      />

      <TextFormField control={control} name="name" label="Link Name" />

      <ComboboxFormField
        control={control}
        name="type"
        label="Link Type"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...typeAdapter}
      />

      <ComboboxFormField
        control={control}
        name="linkStrength"
        label="Link Strength"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...strengthAdapter}
      />
    </>
  );
}
