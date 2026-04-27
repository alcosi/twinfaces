import { Control } from "react-hook-form";
import z from "zod";

import {
  ComboboxFormField,
  SwitchFormField,
  TextFormField,
} from "@/components/form-fields";

import {
  NOTIFICATION_SCHEMA,
  useRecipientSelectAdapter,
} from "@/entities/notification";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";
import { useValidatorSetSelectAdapter } from "@/entities/validator-set";

export function NotificationFormFields({
  control,
}: {
  control: Control<z.infer<typeof NOTIFICATION_SCHEMA>>;
}) {
  const twinClassAdapter = useTwinClassSelectAdapter();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapter();
  const validatorSetAdapter = useValidatorSetSelectAdapter();
  const recipientAdapter = useRecipientSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Twin class"
        selectPlaceholder="Select twin class..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        required
        {...twinClassAdapter}
      />
      <ComboboxFormField
        control={control}
        name="twinClassFieldId"
        label="Twin class field"
        selectPlaceholder="Select twin class field..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinClassFieldAdapter}
      />
      // TODO Replace by [input field] history type
      https://alcosi.atlassian.net/browse/TWINFACES-784
      <TextFormField
        control={control}
        name="historyTypeId"
        label="History type"
        required
      />
      // TODO Replace by [input field] notification schema
      https://alcosi.atlassian.net/browse/TWINFACES-786
      <TextFormField
        control={control}
        name="notificationSchemaId"
        label="Notification schema"
        required
      />
      <ComboboxFormField
        control={control}
        name="historyNotificationRecipientId"
        label="History notification recipient"
        selectPlaceholder="Select recipient..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        required
        {...recipientAdapter}
      />
      // TODO Replace by [input filed] notification channel event
      https://alcosi.atlassian.net/browse/TWINFACES-788
      <TextFormField
        control={control}
        name="notificationChannelEventId"
        label="Notification channel event"
        required
      />
      <ComboboxFormField
        control={control}
        name="twinValidatorSetId"
        label="Twin validator set"
        selectPlaceholder="Select twin validator set..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...validatorSetAdapter}
      />
      <SwitchFormField
        control={control}
        name="twinValidatorSetInvert"
        label="Twin validator set invert"
      />
    </>
  );
}
