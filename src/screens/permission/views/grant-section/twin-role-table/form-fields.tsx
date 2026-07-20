import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { SwitchFormField } from "@/components/form-fields";

import {
  PERMISSION_GRANT_TWIN_ROLE_SCHEMA,
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
import {
  usePermissionSchemaFilters,
  usePermissionSchemaSelectAdapterWithFilters,
} from "@/entities/permission-schema";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isTruthy } from "@/shared/libs";

export function TwinRoleTableFormFields({
  control,
}: {
  control: Control<z.infer<typeof PERMISSION_GRANT_TWIN_ROLE_SCHEMA>>;
}) {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapterWithFilters();
  const permissionAdapter = usePermissionSelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const permissionWatch = useWatch({ control, name: "permissionId" });
  const disabled = useRef(isTruthy(permissionWatch)).current;

  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();
  const {
    buildFilterFields: buildPermissionSchemaFilters,
    mapFiltersToPayload: mapPermissionSchemaFilters,
  } = usePermissionSchemaFilters();
  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const permissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Permission",
    adapter: permissionAdapter,
    extraFilters: buildPermissionFilters(),
    mapExtraFilters: (filters) => mapPermissionFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled,
  };

  const permissionSchemaInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Permission schema",
    adapter: permissionSchemaAdapter,
    extraFilters: buildPermissionSchemaFilters(),
    mapExtraFilters: (filters) => mapPermissionSchemaFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => ({
      ...mapTwinClassFilters(filters),
      abstractt: "ONLY_NOT",
    }),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="permissionId"
        info={permissionInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="permissionSchemaId"
        info={permissionSchemaInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={twinClassInfo}
      />

      {/*TODO commented out because the logic has changed to checkboxes*/}
      {/*<ComboboxFormField*/}
      {/*  control={control}*/}
      {/*  name="twinRole"*/}
      {/*  label="Twin role"*/}
      {/*  selectPlaceholder="Select..."*/}
      {/*  searchPlaceholder="Search..."*/}
      {/*  noItemsText="No data found"*/}
      {/*  {...createFixedSelectAdapter(TWIN_ROLE)}*/}
      {/*/>*/}

      <SwitchFormField
        control={control}
        name="grantedToAssignee"
        label="Is assignee"
      />

      <SwitchFormField
        control={control}
        name="grantedToCreator"
        label="Is creator"
      />

      <SwitchFormField
        control={control}
        name="grantedToSpaceAssignee"
        label="Is space assignee"
      />

      <SwitchFormField
        control={control}
        name="grantedToSpaceCreator"
        label="Is space creator"
      />
    </>
  );
}
