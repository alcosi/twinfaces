import { useRef } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

import {
  CheckboxFormField,
  ComboboxFormField,
  TextFormField,
} from "@/components/form-fields";

import { TRIGGER_SCHEMA_IMPORT } from "@/entities/transition-trigger/libs/constants";
import { useTransitionSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger/libs";
import { isTruthy } from "@/shared/libs";

type TriggersFormValues = z.infer<typeof TRIGGER_SCHEMA_IMPORT>;

export function TriggersFormFields({
  control,
  transitionId,
}: {
  control: Control<TriggersFormValues>;
  transitionId?: string;
}) {
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const transitionAdapter = useTransitionSelectAdapter();
  const disabled = useRef(isTruthy(transitionId)).current;

  return (
    <>
      <ComboboxFormField   //?
        control={control}
        name="twinflowTransitionId"
        label="Transition"
        searchPlaceholder="Search..."
        selectPlaceholder="Select transition..."
        noItemsText="No data found"
        {...transitionAdapter}
        disabled={disabled}
        required
      />
      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
      <CheckboxFormField control={control} name="active" label="Active" />
      <ComboboxFormField
        control={control}
        name="twinTriggerId"
        label="Twin trigger"
        searchPlaceholder="Search..."
        selectPlaceholder="Select twin trigger..."
        noItemsText="No data found"
        {...twinTriggerAdapter}
        required
      />
      <CheckboxFormField control={control} name="async" label="Async" />
    </>
  );
}
