import {
  ColorPickerFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";
import { TwinClassStatusFormValues } from "@/entities/twin-status";
import { TwinClassSelectField } from "@/features/twinClass";
import { isPopulatedString } from "@/shared/libs";
import { Control, Path, useWatch } from "react-hook-form";

export function TwinClassStatusFormFields({
  control,
}: {
  control: Control<TwinClassStatusFormValues>;
}) {
  const twinClassId = useWatch({ control, name: "twinClassId" });
  console.log("foobar twinClassId", twinClassId);

  return (
    <>
      <TwinClassSelectField
        control={control}
        name="twinClassId"
        label="Class"
        disabled={isPopulatedString(twinClassId)}
      />

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
