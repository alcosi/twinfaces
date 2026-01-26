import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import z from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { CheckboxFormField, ComboboxFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import {
  PROJECTION_SCHEMA,
  useProjectionTypeSelectAdapter,
} from "@/entities/projection/libs";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import { isPopulatedString, isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function ProjectionFormFields({
  control,
}: {
  control: Control<z.infer<typeof PROJECTION_SCHEMA>>;
}) {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();

  const twinClassId = useWatch({ control, name: "dstTwinClassId" });
  const srcTwinClassFieldWatch = useWatch({
    control,
    name: "srcTwinClassFieldId",
  });
  const srcTwinClassFieldDisabled = useRef(
    isTruthy(srcTwinClassFieldWatch)
  ).current;

  const dstTwinClassFieldWatch = useWatch({
    control,
    name: "dstTwinClassFieldId",
  });
  const dstTwinClassFieldDisabled = useRef(
    isTruthy(dstTwinClassFieldWatch)
  ).current;

  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFieldFilters(
    {}
  );

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const dstTwinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Dst class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(twinClassId),
  };

  const srcFieldInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Src field",
    adapter: twinClassFieldAdapter,
    extraFilters: buildFilterFields(),
    mapExtraFilters: mapFiltersToPayload,
    selectPlaceholder: "Select...",
    searchPlaceholder: "Search...",
    disabled: srcTwinClassFieldDisabled,
  };

  const dstFieldInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Dst field",
    adapter: twinClassFieldAdapter,
    extraFilters: buildFilterFields(),
    mapExtraFilters: mapFiltersToPayload,
    selectPlaceholder: "Select...",
    searchPlaceholder: "Search...",
    disabled: dstTwinClassFieldDisabled,
  };

  return (
    <>
      <ComboboxFormField
        control={control}
        name="projectionTypeId"
        label="Type"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...projectionTypeAdapter}
      />

      <ComplexComboboxFormField
        control={control}
        name="srcTwinClassFieldId"
        info={srcFieldInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="dstTwinClassId"
        info={dstTwinClassInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="dstTwinClassFieldId"
        info={dstFieldInfo}
      />

      <CheckboxFormField control={control} name="active" label="Active" />

      <FeaturerFormField
        typeId={FeaturerTypes.projector}
        control={control}
        label="Projector"
        name="fieldProjectorFeaturerId"
        paramsFieldName="fieldProjectorParams"
      />
    </>
  );
}
