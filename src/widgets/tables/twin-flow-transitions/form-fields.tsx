import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";

import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import {
  TwinFlowTransitionFormValues,
  useTransitionAliasSelectAdapter,
} from "@/entities/twin-flow-transition";
import { TwinStatusSelectField } from "@/features/twinStatus";
import { isPopulatedArray, isTruthy } from "@/shared/libs";

export function TwinFlowTransitionFormFields({
  control,
}: {
  control: Control<TwinFlowTransitionFormValues>;
}) {
  const twinflow = useWatch({ control, name: "twinflow" });
  const disabled = useRef(isPopulatedArray(twinflow)).current;
  const twinFlowAdapter = useTwinFlowSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinflow"
        label="Twinflow"
        selectPlaceholder="Select Twinflow"
        searchPlaceholder="Search Twinflow..."
        noItemsText="No Twinflow found"
        disabled={disabled}
        required={true}
        {...twinFlowAdapter}
      />

      <ComboboxFormField
        control={control}
        name="alias"
        label="Alias"
        selectPlaceholder="Select Alias"
        searchPlaceholder="Search Alias..."
        noItemsText="No Alias found"
        required={true}
        creatable
        {...transitionAliasAdapter}
      />

      <TextFormField
        control={control}
        name="name"
        label="Name"
        required={true}
      />

      <TextFormField control={control} name="description" label="Description" />

      <ComboboxFormField
        control={control}
        name={"factory"}
        label="Factory"
        selectPlaceholder="Select Factory"
        searchPlaceholder="Search Factory..."
        noItemsText="No Factory found"
        {...factoryAdapter}
      />

      {isTruthy(twinflow) && twinflow.length > 0 && (
        <TwinStatusSelectField
          twinClassId={twinflow?.[0]?.twinClassId}
          control={control}
          name="srcTwinStatusId"
          label="From status"
        />
      )}

      {isTruthy(twinflow) && twinflow.length > 0 && (
        <TwinStatusSelectField
          twinClassId={twinflow?.[0]?.twinClassId}
          control={control}
          name="dstTwinStatusId"
          label="To status"
          required={true}
        />
      )}

      <ComboboxFormField
        control={control}
        name={"permissionId"}
        label="Permission"
        selectPlaceholder="Select permission"
        searchPlaceholder="Search permission..."
        noItemsText="No permission found"
        {...permissionAdapter}
      />
    </>
  );
}
