import { Control, Path } from "react-hook-form";
import { z } from "zod";

import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import { DATALIST_SCHEMA } from "@/entities/datalist";

export function DatalistFormFields<T extends z.infer<typeof DATALIST_SCHEMA>>({
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
    </>
  );
}
