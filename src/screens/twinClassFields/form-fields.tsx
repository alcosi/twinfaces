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

      <FeaturerFormField
        typeId={FeaturerTypes.fieldTyper}
        control={control}
        name={"fieldTyperFeaturerId" as Path<T>}
        label={"Featurer"}
      />

      <TextFormField
        control={control}
        name={"viewPermissionId" as Path<T>}
        label="View permission ID"
      />

      <TextFormField
        control={control}
        name={"editPermissionId" as Path<T>}
        label="Edit permission ID"
      />

      <CheckboxFormField
        control={control}
        name={"required" as Path<T>}
        label="Required"
      />
    </>
  );
}
