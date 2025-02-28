import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { usePermissionSelectAdapter } from "@/entities/permission";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import {
  PERMISSION_GRANT_USER_GROUP_SCHEMA,
  useUserGroupSelectAdapter,
} from "@/entities/userGroup";
import { isTruthy } from "@/shared/libs";

export function UserGroupTableFormFields({
  control,
}: {
  control: Control<z.infer<typeof PERMISSION_GRANT_USER_GROUP_SCHEMA>>;
}) {
  const psAdapter = usePermissionSchemaSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const ugAdapter = useUserGroupSelectAdapter();
  const pWatch = useWatch({ control, name: "permissionId" });
  const disabled = useRef(isTruthy(pWatch)).current;

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
        {...pAdapter}
      />

      <ComboboxFormField
        control={control}
        name="permissionSchemaId"
        label="Permission schema"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...psAdapter}
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
