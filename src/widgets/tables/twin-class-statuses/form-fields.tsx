import { Control } from "react-hook-form";
import { TwinClassStatusFormValues } from "@/entities/twinStatus";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { ColorPickerFormField } from "@/components/form-fields/color-form-field";

export function TwinClassStatusFormFields({
  control,
}: {
  control: Control<TwinClassStatusFormValues>;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name="key"
        label="Key"
        autoFocus={true}
      />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <TextFormField control={control} name="logo" label="Logo URL" />

      <ColorPickerFormField
        control={control}
        name="backgroundColor"
        label="Background color"
      />

      <ColorPickerFormField
        control={control}
        name="fontColor"
        label="Font color"
      />
    </>
  );
}
