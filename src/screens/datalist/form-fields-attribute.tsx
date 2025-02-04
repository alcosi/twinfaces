import { TextFormField } from "@/components/form-fields";
import { Control, Path } from "react-hook-form";
import { DATALIST_ATTRIBUTE_SCHEMA } from "@/entities/datalist";
import { z } from "zod";

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
