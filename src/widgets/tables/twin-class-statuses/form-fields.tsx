import {
  ColorPickerFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";
import { TwinClassStatusFormValues } from "@/entities/twin-status";
import { TwinClassSelectField } from "@/features/twinClass";
import { isTruthy } from "@/shared/libs";
import { Control, Path } from "react-hook-form";

export function TwinClassStatusFormFields<T extends TwinClassStatusFormValues>({
  control,
  twinClassId,
}: {
  control: Control<T>;
  twinClassId?: string;
}) {
  return (
    <>
      <TwinClassSelectField
        control={control}
        name={"TwinClassId" as Path<T>}
        label="Class"
        disabled={isTruthy(twinClassId)}
      />

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

      <TextFormField
        control={control}
        name={"logo" as Path<T>}
        label="Logo URL"
      />

      <ColorPickerFormField
        control={control}
        name={"backgroundColor" as Path<T>}
        label="Background color"
      />

      <ColorPickerFormField
        control={control}
        name={"fontColor" as Path<T>}
        label="Font color"
      />
    </>
  );
}
