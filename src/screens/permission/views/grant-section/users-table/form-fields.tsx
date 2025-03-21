import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import {
  PERMISSION_GRANT_USER_SCHEMA,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useUserSelectAdapter } from "@/entities/user";
import { isTruthy } from "@/shared/libs";

export function UserTableFormFields({
  control,
}: {
  control: Control<z.infer<typeof PERMISSION_GRANT_USER_SCHEMA>>;
}) {
  const psAdapter = usePermissionSchemaSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const uAdapter = useUserSelectAdapter();
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
        autoFocus={true}
        {...psAdapter}
      />

      <ComboboxFormField
        control={control}
        name="userId"
        label="User"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...uAdapter}
      />
    </>
  );
}
