import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { CheckboxFormField, ComboboxFormField } from "@/components/form-fields";

import {
  PERMISSION_GRANT_ASSIGNEE_PROPAGATION_SCHEMA,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { isFalsy, isTruthy } from "@/shared/libs";

export function AssigneePropagationFormFields({
  control,
}: {
  control: Control<
    z.infer<typeof PERMISSION_GRANT_ASSIGNEE_PROPAGATION_SCHEMA>
  >;
}) {
  const permissionAdapter = usePermissionSelectAdapter();
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();

  const permissionWatch = useWatch({ control, name: "permissionId" });
  const twinClassWatch = useWatch({
    control,
    name: "propagationByTwinClassId",
  }) as unknown as { id: string }[];
  const twinStatusAdapter = useTwinStatusSelectAdapter(twinClassWatch[0]?.id);
  const disabledPermission = useRef(isTruthy(permissionWatch)).current;
  const disabledTwinStatus = isFalsy(twinClassWatch[0]?.id);

  return (
    <>
      <ComboboxFormField
        control={control}
        name="permissionId"
        label="Permission"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabledPermission}
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
        name="propagationByTwinClassId"
        label="Propagation by twin class"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassAdapter}
        getItems={async (search: string) => {
          return twinClassAdapter.getItems(search, { abstractt: "ONLY_NOT" });
        }}
      />

      <ComboboxFormField
        control={control}
        name="propagationByTwinStatusId"
        label="Propagation by twin status"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabledTwinStatus}
        {...twinStatusAdapter}
      />

      <CheckboxFormField
        control={control}
        name="inSpaceOnly"
        label="In space only"
      />
    </>
  );
}
