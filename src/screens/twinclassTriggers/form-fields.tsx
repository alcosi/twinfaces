import { Control, FieldValues, Path } from "react-hook-form";
import { TextFormField } from "@/components/form-fields/text-form-field";
import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";
import { FeaturerFormField } from "@/components/form-fields/featurer-form-field";
import { FeaturerTypes } from "@/entities/featurer";

export function TriggersFormFields<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name={"order" as Path<T>}
        label="Order"
        type="number"
      />
      <CheckboxFormField
        control={control}
        name={"active" as Path<T>}
        label="Active"
      />
      <FeaturerFormField
        typeId={FeaturerTypes.trigger}
        control={control}
        name={"fieldTyperFeaturerId" as Path<T>}
        paramsName={"fieldTyperParams" as Path<T>}
        label={"Featurer"}
      />
    </>
  );
}
