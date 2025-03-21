import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import {
  PERMISSION_GRANT_SPACE_ROLE_SCHEMA,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useSpaceRoleSelectAdapter } from "@/entities/space-role";
import { isTruthy } from "@/shared/libs";

export function SpaceRoleTableFormFields({
  control,
}: {
  control: Control<z.infer<typeof PERMISSION_GRANT_SPACE_ROLE_SCHEMA>>;
}) {
  const permissionAdapter = usePermissionSelectAdapter();
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const spaceRoleAdapter = useSpaceRoleSelectAdapter();
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
        noItemsText="No data found"
        disabled={disabled}
        {...permissionAdapter}
      />

      <ComboboxFormField
        control={control}
        name="permissionSchemaId"
        label="Permission schema"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...permissionSchemaAdapter}
      />

      <ComboboxFormField
        control={control}
        name="spaceRoleId"
        label="Space role"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...spaceRoleAdapter}
      />
    </>
  );
}
