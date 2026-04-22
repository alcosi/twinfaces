import { useRef } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField, SwitchFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import {
  RECIPIENT_COLLECTOR_SCHEMA,
  useRecipientSelectAdapter,
} from "@/entities/notification";
import { isTruthy } from "@/shared/libs/index";

import { FeaturerFormField } from "../../form-fields";

export function RecipientCollectorFormFields({
  control,
  recipientId,
}: {
  control: Control<z.infer<typeof RECIPIENT_COLLECTOR_SCHEMA>>;
  recipientId?: string;
}) {
  const notificationRecipientAdapter = useRecipientSelectAdapter();
  const disabled = useRef(isTruthy(recipientId)).current;

  return (
    <>
      <ComboboxFormField
        control={control}
        name="recipientId"
        label="Notification recipient"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        disabled={disabled}
        {...notificationRecipientAdapter}
      />

      <FeaturerFormField
        typeId={FeaturerTypes.recipientResolver}
        control={control}
        label="Recipient resolver featurer"
        name="recipientResolverFeaturerId"
        paramsFieldName="recipientResolverParams"
      />
      <SwitchFormField control={control} name="exclude" label="Exclude" />
    </>
  );
}
