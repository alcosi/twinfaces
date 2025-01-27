import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";
import { TextFormField } from "@/components/form-fields/text-form-field";
import { FeaturerTypes } from "@/entities/featurer";
import { FeaturerFormField } from "@/widgets/form-fields";
import { Control, FieldValues, Path } from "react-hook-form";

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
        label={"Featurer"}
      />
    </>
  );
}
