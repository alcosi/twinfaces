import { Control } from "react-hook-form";
import { z } from "zod";

import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import { RECIPIENT_SCHEMA } from "@/entities/notification";

export function RecipientFormFields({
  control,
}: {
  control: Control<z.infer<typeof RECIPIENT_SCHEMA>>;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name="name"
        label="Name"
        autoFocus={true}
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
    </>
  );
}
