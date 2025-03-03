import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import {
  PERMISSION_GRANT_TWIN_ROLE_SCHEMA,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinRoleSelectAdapter } from "@/entities/twin-role";
import { isTruthy } from "@/shared/libs";

export function TwinRoleTableFormFields({
  control,
}: {
  control: Control<z.infer<typeof PERMISSION_GRANT_TWIN_ROLE_SCHEMA>>;
}) {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter({ excludeAbstract: true });
  const twinRoleAdapter = useTwinRoleSelectAdapter();
  const permissionWatch = useWatch({ control, name: "permissionId" });
  const disabled = useRef(isTruthy(permissionWatch)).current;

  return (
    <>
      <ComboboxFormField
        control={control}
        name="permissionId"
        label="Permission"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data fount"
        disabled={disabled}
        {...permissionAdapter}
      />

      <ComboboxFormField
        control={control}
        name="permissionSchemaId"
        label="Permission schema"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data fount"
        {...permissionSchemaAdapter}
      />

      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Twin class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data fount"
        {...twinClassAdapter}
      />

      <ComboboxFormField
        control={control}
        name="twinRole"
        label="Twin role"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinRoleAdapter}
      />
    </>
  );
}
