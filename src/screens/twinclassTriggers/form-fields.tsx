import { Control } from "react-hook-form";

import { CheckboxFormField, TextFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import { TriggersFormValues } from "@/entities/twin-flow-transition";
import { FeaturerFormField } from "@/widgets/form-fields";

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
      <CheckboxFormField control={control} name="active" label="Active" />
      <FeaturerFormField
        typeId={FeaturerTypes.trigger}
        control={control}
        label="Featurer"
        name="triggerFeaturerId"
        paramsFieldName="triggerParams"
      />
    </>
  );
}
