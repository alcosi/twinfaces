import { Control } from "react-hook-form";
import z from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import {
  PROJECTION_SCHEMA,
  useProjectionTypeSelectAdapter,
} from "@/entities/projection/libs";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";

import { FeaturerFormField } from "../../form-fields";

export function ProjectionFormFields({
  control,
}: {
  control: Control<z.infer<typeof PROJECTION_SCHEMA>>;
}) {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();

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

      <ComboboxFormField
        control={control}
        name="srcTwinClassFieldId"
        label="Src field"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassFieldAdapter}
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

      <ComboboxFormField
        control={control}
        name="dstTwinClassFieldId"
        label="Dst field"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassFieldAdapter}
      />

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
