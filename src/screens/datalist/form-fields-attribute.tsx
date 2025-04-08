import { Control, Path } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import { DATALIST_ATTRIBUTE_SCHEMA } from "@/entities/datalist";

export function DatalistAttributeFormFields<
  T extends z.infer<typeof DATALIST_ATTRIBUTE_SCHEMA>,
>({ control }: { control: Control<T> }) {
  return (
    <>
      <TextFormField
        control={control}
        name={"key" as Path<T>}
        label="Key"
        autoFocus={true}
      />

      <TextFormField control={control} name={"name" as Path<T>} label="Name" />
    </>
  );
}
