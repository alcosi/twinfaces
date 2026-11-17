import { Control } from "react-hook-form";
import { z } from "zod";

import {
  FileFormField,
  SwitchFormField,
  TextFormField,
} from "@/components/form-fields";

import { RESOURCE_UPLOAD_SCHEMA } from "@/entities/resource";

export function ResourceFormFields({
  control,
}: {
  control: Control<z.infer<typeof RESOURCE_UPLOAD_SCHEMA>>;
}) {
  return (
    <>
      <FileFormField control={control} name="file" label="File" required />

      {/* `required` only drives RequiredFieldsGate so Title shows alongside
          File in the default view — the schema itself keeps it optional. */}
      <TextFormField
        control={control}
        name="title"
        label="Title"
        description="Defaults to the uploaded file name"
        required
      />

      <SwitchFormField
        control={control}
        name="isPublic"
        label="Public"
        description="Available via the public download link"
      />
    </>
  );
}
