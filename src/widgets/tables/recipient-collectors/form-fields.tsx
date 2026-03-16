import { Control } from "react-hook-form";
import { z } from "zod";

import { CheckboxFormField, ComboboxFormField } from "@/components/form-fields";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  RECIPIENT_COLLECTOR_SCHEMA,
  useRecipientSelectAdapter,
} from "@/entities/notification";

export function RecipientCollectorFormFields({
  control,
}: {
  control: Control<z.infer<typeof RECIPIENT_COLLECTOR_SCHEMA>>;
}) {
  const notificationRecipientAdapter = useRecipientSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(47);

  return (
    <>
      <ComboboxFormField
        control={control}
        name="recipientId"
        label="Notification recipient"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...notificationRecipientAdapter}
      />

      <ComboboxFormField
        control={control}
        name="recipientResolverFeaturerId"
        label="Recipient resolver featurer"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...featurerAdapter}
      />
      <CheckboxFormField control={control} name="exclude" label="Exclude" />
    </>
  );
}
