import { Control } from "react-hook-form";
import { z } from "zod";

import {
  CheckboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { VALIDATOR_SETS_SHEMA } from "@/entities/validator-set";

export function ValidatorSetFormFields({
  control,
}: {
  control: Control<z.infer<typeof VALIDATOR_SETS_SHEMA>>;
}) {
  return (
    <>
      <TextFormField control={control} name="name" label="Name" />
      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />
      <CheckboxFormField control={control} name="invert" label="Invert" />
    </>
  );
}
