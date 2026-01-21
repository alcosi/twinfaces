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
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function ProjectionFormFields({
  control,
}: {
  control: Control<z.infer<typeof PROJECTION_SCHEMA>>;
}) {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();

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

      <ComboboxFormField
        control={control}
        name="dstTwinClassId"
        label="Dst class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassAdapter}
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
