import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  ComboboxFormField,
  SwitchFormField,
  TextFormField,
} from "@/components/form-fields";

import { STATUS_TRIGGER_SCHEMA } from "@/entities/status-trigger";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import { isTruthy } from "@/shared/libs";

type TriggersFormValues = z.infer<typeof STATUS_TRIGGER_SCHEMA>;

export function StatusTriggerFormFields({
  control,
}: {
  control: Control<TriggersFormValues>;
}) {
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const twinTriggerWatch = useWatch({ control, name: "twinTriggerId" });
  const disabled = useRef(isTruthy(twinTriggerWatch)).current;
  const statusWatch = useWatch({ control, name: "twinStatusId" });
  const disabledStatus = useRef(isTruthy(statusWatch)).current;
  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinStatusId"
        label="Twin status"
        searchPlaceholder="Search..."
        selectPlaceholder="Select twin status..."
        noItemsText="No data found"
        {...twinStatusAdapter}
        required
        disabled={disabledStatus}
      />
      <SwitchFormField
        control={control}
        name="incomingElseOutgoing"
        label="Incoming else outgoint"
      />
      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
      <ComboboxFormField
        control={control}
        name="twinTriggerId"
        label="Twin trigger"
        searchPlaceholder="Search..."
        selectPlaceholder="Select twin trigger..."
        noItemsText="No data found"
        {...twinTriggerAdapter}
        required
        disabled={disabled}
      />
      <SwitchFormField control={control} name="async" label="Async" />
      <SwitchFormField control={control} name="active" label="Active" />
    </>
  );
}
