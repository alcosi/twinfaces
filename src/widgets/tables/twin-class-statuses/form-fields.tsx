import {
  ColorPickerFormField,
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";
import { TwinClassStatusFormValues } from "@/entities/twin-status";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { isPopulatedString } from "@/shared/libs";
import { Control, useWatch } from "react-hook-form";

export function TwinClassStatusFormFields({
  control,
}: {
  control: Control<TwinClassStatusFormValues>;
}) {
  const twinClassId = useWatch({ control, name: "twinClassId" });
  const tcAdapter = useTwinClassSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Class"
        disabled={isPopulatedString(twinClassId)}
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
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
