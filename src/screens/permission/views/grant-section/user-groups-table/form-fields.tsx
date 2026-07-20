import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { ComboboxFormField } from "@/components/form-fields";

import {
  PERMISSION_GRANT_USER_GROUP_SCHEMA,
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
import {
  usePermissionSchemaFilters,
  usePermissionSchemaSelectAdapterWithFilters,
} from "@/entities/permission-schema";
import { useUserGroupSelectAdapter } from "@/entities/user-group";
import { isTruthy } from "@/shared/libs";

export function UserGroupTableFormFields({
  control,
}: {
  control: Control<z.infer<typeof PERMISSION_GRANT_USER_GROUP_SCHEMA>>;
}) {
  const psAdapter = usePermissionSchemaSelectAdapterWithFilters();
  const pAdapter = usePermissionSelectAdapterWithFilters();
  const ugAdapter = useUserGroupSelectAdapter();
  const pWatch = useWatch({ control, name: "permissionId" });
  const disabled = useRef(isTruthy(pWatch)).current;

  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();
  const {
    buildFilterFields: buildPermissionSchemaFilters,
    mapFiltersToPayload: mapPermissionSchemaFilters,
  } = usePermissionSchemaFilters();

  const permissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Permission",
    adapter: pAdapter,
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
    adapter: psAdapter,
    extraFilters: buildPermissionSchemaFilters(),
    mapExtraFilters: (filters) => mapPermissionSchemaFilters(filters),
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

      <ComboboxFormField
        control={control}
        name="userGroupId"
        label="User group"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...ugAdapter}
      />
    </>
  );
}
