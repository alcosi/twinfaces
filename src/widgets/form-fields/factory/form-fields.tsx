import { Control } from "react-hook-form";
import { z } from "zod";

import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import { FACTORY_SCHEMA } from "@/entities/factory";

export function FactoryFormFields({
  control,
}: {
  control: Control<z.infer<typeof FACTORY_SCHEMA>>;
}) {
  return (
    <>
      <TextFormField control={control} name="key" label="Key" required />

      <TextFormField control={control} name="name" label="Name" required />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
