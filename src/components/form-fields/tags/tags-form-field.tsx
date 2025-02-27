import { FieldValues } from "react-hook-form";

import { isEmptyString } from "@/shared/libs";
import { FormField, TagBoxProps } from "@/shared/ui";

import { FormFieldProps } from "../types";
import { TagsFormItem } from "./tags-form-item";

type Props<T extends FieldValues, K> = FormFieldProps<T> & TagBoxProps<K>;

export function TagsFormField<TForm extends FieldValues, TField>({
  name,
  control,
  idPrefix,
  label,
  description,
  schema,
  // NOTE: Extract onChange to avoid overwriting field.onChange in {...props}
  onChange,
  ...props
}: Props<TForm, TField>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <TagsFormItem
          fieldValue={isEmptyString(field.value) ? [] : field.value}
          inputId={inputId}
          label={label}
          description={description}
          inForm={true}
          schema={schema}
          onChange={(x) => field.onChange(x)}
          {...props}
        />
      )}
    />
  );
}
