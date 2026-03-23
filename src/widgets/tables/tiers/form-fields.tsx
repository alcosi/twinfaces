import { Control } from "react-hook-form";
import z from "zod";

import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { TIER_SCHEMA } from "@/entities/tier/libs";
import { useTwinClassSchemaSelectAdapter } from "@/entities/twin-class-schema";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";

export function TierFormFields({
  control,
}: {
  control: Control<z.infer<typeof TIER_SCHEMA>>;
}) {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const twinflowSchemaAdapter = useTwinFlowSchemaSelectAdapter();
  const twinClassSchemaAdapter = useTwinClassSchemaSelectAdapter();

  return (
    <>
      <TextFormField control={control} name="name" label="Name" required />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <CheckboxFormField control={control} name="custom" label="Custom" />

      <ComboboxFormField
        control={control}
        name="permissionSchemaId"
        label="Permission schema"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...permissionSchemaAdapter}
        required
      />

      <ComboboxFormField
        control={control}
        name="twinflowSchemaId"
        label="Twinflow schema"
        searchPlaceholder="Search..."
        selectPlaceholder="Select..."
        noItemsText="No data found"
        {...twinflowSchemaAdapter}
        required
      />

      <ComboboxFormField
        control={control}
        name="twinClassSchemaId"
        label="Twinclass schema"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassSchemaAdapter}
        required
      />

      <TextFormField
        control={control}
        name="attachmentsStorageQuotaSize"
        label="Attachments storage quota size"
        type="number"
        required
      />

      <TextFormField
        control={control}
        name="attachmentsStorageQuotaCount"
        label="Attachments storage quota count"
        type="number"
        required
      />

      <TextFormField
        control={control}
        name="userCountQuota"
        label="User count quota"
        type="number"
        required
      />
    </>
  );
}
