import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { FeaturerTypes } from "@/entities/featurer";
import { FeaturerFormField } from "@/widgets/form-fields";
import { Control, FieldValues, Path } from "react-hook-form";

export function TwinClassFieldFormFields<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name={"key" as Path<T>}
        label="Key"
        autoFocus={true}
      />

      <TextFormField control={control} name={"name" as Path<T>} label="Name" />

      <TextAreaFormField
        control={control}
        name={"description" as Path<T>}
        label="Description"
      />

      <CheckboxFormField
        control={control}
        name={"required" as Path<T>}
        label="Required"
      />

      <FeaturerFormField
        typeId={FeaturerTypes.fieldTyper}
        control={control}
        name={"fieldTyperFeaturerId" as Path<T>}
        label={"Featurer"}
      />
    </>
  );
}
