import { Control } from "react-hook-form";
import { z } from "zod";

import { CheckboxFormField, ComboboxFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import {
  RECIPIENT_COLLECTOR_SCHEMA,
  useRecipientSelectAdapter,
} from "@/entities/notification";

import { FeaturerFormField } from "../../form-fields";

export function RecipientCollectorFormFields({
  control,
}: {
  control: Control<z.infer<typeof RECIPIENT_COLLECTOR_SCHEMA>>;
}) {
  const notificationRecipientAdapter = useRecipientSelectAdapter();

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

      <FeaturerFormField
        typeId={FeaturerTypes.recipientResolver}
        control={control}
        label="Recipient resolver featurer"
        name="recipientResolverFeaturerId"
        paramsFieldName="recipientResolverParams"
      />
      <CheckboxFormField control={control} name="exclude" label="Exclude" />
    </>
  );
}
