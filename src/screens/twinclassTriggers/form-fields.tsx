import { Control } from "react-hook-form";
import { z } from "zod";

import { CheckboxFormField, TextFormField } from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import { FeaturerFormField } from "@/widgets/form-fields";

type TriggersFormValues = z.infer<any>;

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
        autoFocus={true}
      />
      <CheckboxFormField control={control} name={"active"} label="Active" />
      <FeaturerFormField
        typeId={FeaturerTypes.trigger}
        control={control}
        label={"Featurer"}
        name="fieldTyperFeaturerId"
        paramsFieldName="fieldTyperFeaturerParams"
      />
    </>
  );
}
