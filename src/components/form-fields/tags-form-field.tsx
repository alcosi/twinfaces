import { isArray, isEmptyString, isPopulatedString } from "@/shared/libs";
import {
  FormControl,
  FormField,
  FormMessage,
  TagBox,
  TagBoxHandle,
  TagBoxProps,
} from "@/shared/ui";
import { ReactNode, useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "./form-fields-common";

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

export function TagsFormItem<TField>({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inputId,
  inForm,
  ...props
}: TagBoxProps<TField> & {
  fieldValue?: TField[];
  onChange?: (value?: TField[]) => void;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  inputId?: string;
  inForm?: boolean;
}) {
  const tagboxRef = useRef<TagBoxHandle<TField> | null>(null);

  useEffect(() => {
    if (isArray(fieldValue)) {
      tagboxRef.current?.set([...fieldValue]);
    } else if (isPopulatedString(fieldValue)) {
      tagboxRef.current?.set([fieldValue]);
    }
  }, []);

  return (
    <div>
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}
      <FormControl>
        <TagBox<TField>
          ref={tagboxRef}
          id={inputId}
          initialTags={fieldValue}
          onTagsChange={(tags) => {
            onChange?.(tags);
          }}
          {...props}
        />
      </FormControl>

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </div>
  );
}
