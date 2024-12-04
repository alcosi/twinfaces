import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { TwinStatusSelectField } from "@/features/twinStatus";
import { Control, FieldValues, Path } from "react-hook-form";

export function TwinClassTwinFlowFormFields<T extends FieldValues>({
  control,
  twinClassId,
}: {
  control: Control<T>;
  twinClassId: string;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name={"name" as Path<T>}
        label="Name"
        autoFocus={true}
      />

      <TextAreaFormField
        control={control}
        name={"description" as Path<T>}
        label="Description"
      />

      <TwinStatusSelectField
        twinClassId={twinClassId}
        control={control}
        name={"initialStatusId" as Path<T>}
        label="Initial status"
        required={true}
      />
    </>
  );
}
