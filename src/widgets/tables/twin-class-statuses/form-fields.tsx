import {
  ColorPickerFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";
import { TwinClassStatusFormValues } from "@/entities/twinStatus";
import { Control } from "react-hook-form";

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
