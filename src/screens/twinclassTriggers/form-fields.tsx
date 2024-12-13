import { Control } from "react-hook-form";
import { TriggersFormValues } from "@/entities/twinFlowTransition";
import { TextFormField } from "@/components/form-fields/text-form-field";
import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";

export function TriggersFormFields({
  control,
}: {
  control: Control<TriggersFormValues>;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
      <CheckboxFormField control={control} name={"active"} label="Active" />
    </>
  );
}
