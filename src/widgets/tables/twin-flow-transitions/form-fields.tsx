import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
import {
  useTwinFlowFilters,
  useTwinFlowSelectAdapterWithFilters,
} from "@/entities/twin-flow";
import {
  TwinFlowTransitionFormValues,
  useTransitionAliasSelectAdapter,
  useTransitionSelectTypeAdapter,
} from "@/entities/twin-flow-transition";
import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
import {
  isFalsy,
  isPopulatedArray,
  isTruthy,
  reduceToObject,
  toArray,
} from "@/shared/libs";

export function TwinFlowTransitionFormFields({
  type,
  twinStatusId,
  control,
}: {
  twinStatusId?: string;
  type?: string;
  control: Control<TwinFlowTransitionFormValues>;
}) {
  const twinFlowWatch = useWatch({ control, name: "twinflow" });
  const isPreselected = useRef(isPopulatedArray(twinFlowWatch)).current;

  const twinClassId = twinFlowWatch[0]?.twinClassId;
  const disabledStatus = isFalsy(twinClassId);

  const disabledSrcStatus = isTruthy(twinStatusId) && type === "Incoming";
  const disabledDstStatus = isTruthy(twinStatusId) && type === "Outgoing";

  const twinFlowAdapter = useTwinFlowSelectAdapterWithFilters();
  const permissionAdapter = usePermissionSelectAdapterWithFilters();
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();
  const srcTwinStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const dstTwinStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const transitionTypeAdapter = useTransitionSelectTypeAdapter();

  const {
    buildFilterFields: buildTwinFlowFilters,
    mapFiltersToPayload: mapTwinFlowFilters,
  } = useTwinFlowFilters({});

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();

  const {
    buildFilterFields: buildTwinStatusFilters,
    mapFiltersToPayload: mapTwinStatusFilters,
  } = useStatusFilters({});

  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();

  const twinFlowInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twinflow",
    adapter: twinFlowAdapter,
    extraFilters: buildTwinFlowFilters(),
    mapExtraFilters: (filters) => mapTwinFlowFilters(filters),
    searchPlaceholder: "Search Twinflow...",
    selectPlaceholder: "Select Twinflow",
    multi: false,
    disabled: isPreselected,
  };

  const factoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Factory",
    adapter: factoryAdapter,
    extraFilters: buildFactoryFilters(),
    mapExtraFilters: (filters) => mapFactoryFilters(filters),
    searchPlaceholder: "Search Factory...",
    selectPlaceholder: "Select Factory",
    multi: false,
  };

  const srcTwinStatusInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "From status",
    adapter: srcTwinStatusAdapter,
    extraFilters: buildTwinStatusFilters(),
    mapExtraFilters: (filters) => ({
      ...mapTwinStatusFilters(filters),
      twinClassIdMap: reduceToObject({
        list: toArray(twinClassId),
        defaultValue: true,
      }),
    }),
    searchPlaceholder: "Search status...",
    selectPlaceholder: "Select status",
    multi: false,
    disabled: disabledStatus || disabledSrcStatus,
  };

  const dstTwinStatusInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "To status",
    adapter: dstTwinStatusAdapter,
    extraFilters: buildTwinStatusFilters(),
    mapExtraFilters: (filters) => ({
      ...mapTwinStatusFilters(filters),
      twinClassIdMap: reduceToObject({
        list: toArray(twinClassId),
        defaultValue: true,
      }),
    }),
    searchPlaceholder: "Search status...",
    selectPlaceholder: "Select status",
    multi: false,
    disabled: disabledStatus || disabledDstStatus,
  };

  const permissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Permission",
    adapter: permissionAdapter,
    extraFilters: buildPermissionFilters(),
    mapExtraFilters: (filters) => mapPermissionFilters(filters),
    searchPlaceholder: "Search permission...",
    selectPlaceholder: "Select permission",
    multi: false,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinflow"
        info={twinFlowInfo}
        required={true}
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

      <ComplexComboboxFormField
        control={control}
        name="factory"
        info={factoryInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="srcTwinStatusId"
        info={srcTwinStatusInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="dstTwinStatusId"
        info={dstTwinStatusInfo}
        required={true}
      />

      <ComplexComboboxFormField
        control={control}
        name="permissionId"
        info={permissionInfo}
      />

      <ComboboxFormField
        control={control}
        name="twinflowTransitionTypeId"
        label="Transition type"
        selectPlaceholder="Select Transition type"
        noItemsText="No Transition type found"
        {...transitionTypeAdapter}
      />
    </>
  );
}
