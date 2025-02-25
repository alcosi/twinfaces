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
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { isPopulatedArray } from "@/shared/libs";

export function TwinFlowTransitionFormFields({
  control,
}: {
  control: Control<TwinFlowTransitionFormValues>;
}) {
  const twinFlowWatch = useWatch({ control, name: "twinflow" });
  const disabled = useRef(isPopulatedArray(twinFlowWatch)).current;

  const twinFlowAdapter = useTwinFlowSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();
  const twinStatusAdapter = useTwinStatusSelectAdapter(
    twinFlowWatch?.[0]?.twinClassId
  );

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

      <ComboboxFormField
        control={control}
        name={"srcTwinStatusId"}
        label="From status"
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText="No status found"
        disabled={!twinFlowWatch?.length}
        {...twinStatusAdapter}
      />

      <ComboboxFormField
        control={control}
        name={"dstTwinStatusId"}
        label="To status"
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText="No status found"
        required={true}
        disabled={!twinFlowWatch?.length}
        {...twinStatusAdapter}
      />

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
