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
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";

export function TwinFlowTransitionFormFields({
  control,
}: {
  control: Control<TwinFlowTransitionFormValues>;
}) {
  const twinFlowWatch = useWatch({ control, name: "twinflow" });
  const isTwinFlowSelected = isTruthy(twinFlowWatch);
  const isPreselected = useRef(isTwinFlowSelected).current;

  const twinFlowAdapter = useTwinFlowSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();
  const twinStatusAdapter = useTwinStatusSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinflow"
        label="Twinflow"
        selectPlaceholder="Select Twinflow"
        searchPlaceholder="Search Twinflow..."
        noItemsText="No Twinflow found"
        disabled={isPreselected}
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
        name="factory"
        label="Factory"
        selectPlaceholder="Select Factory"
        searchPlaceholder="Search Factory..."
        noItemsText="No Factory found"
        {...factoryAdapter}
      />

      <ComboboxFormField
        control={control}
        name="srcTwinStatusId"
        label="From status"
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText="No status found"
        disabled={!isTwinFlowSelected}
        {...twinStatusAdapter}
        getItems={async (search: string) => {
          return twinStatusAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(twinFlowWatch),
              defaultValue: true,
            }),
          });
        }}
      />

      <ComboboxFormField
        control={control}
        name="dstTwinStatusId"
        label="To status"
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText="No status found"
        required={true}
        disabled={!isTwinFlowSelected}
        {...twinStatusAdapter}
        getItems={async (search: string) => {
          return twinStatusAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(twinFlowWatch),
              defaultValue: true,
            }),
          });
        }}
      />

      <ComboboxFormField
        control={control}
        name="permissionId"
        label="Permission"
        selectPlaceholder="Select permission"
        searchPlaceholder="Search permission..."
        noItemsText="No permission found"
        {...permissionAdapter}
      />
    </>
  );
}
