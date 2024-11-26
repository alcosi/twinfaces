import { FormControl, FormField, FormMessage } from "@/shared/ui/form";
import { Input, InputProps } from "@/shared/ui/input";
import { Textarea, TextareaProps } from "@/shared/ui/textarea";
import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "./form-fields-common";

export interface TextFormFieldProps {
  suggestions?: string[];
}

export function TextFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: FormFieldProps<T> & TextFormFieldProps & Omit<InputProps, "onChange">) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <TextFormItem
            autoFocus={props.autoFocus}
            fieldValue={field.value}
            onChange={(x) => field.onChange(x)}
            inputId={inputId}
            inForm={true}
            {...props}
          />
        );
      }}
    />
  );
}

export function TextFormItem<T extends FieldValues>({
  fieldValue,
  onChange,
  label,
  description,
  required,
  suggestions,
  inputId,
  inForm,
  ...props
}: TextFormFieldProps &
  InputProps & {
    fieldValue?: string;
    label?: ReactNode;
    description?: ReactNode;
    required?: boolean;
    inputId?: string;
    inForm?: boolean;
  }) {
  let currentSuggestions = undefined;
  if (suggestions) {
    const value = fieldValue?.toLowerCase();
    currentSuggestions = value
      ? suggestions.filter((s) => s.toLowerCase().includes(value))
      : suggestions;
  }
  const suggestionsId = inputId ? `${inputId}-suggestions` : undefined;

  return (
    <div>
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}
      <Input
        id={inputId}
        list={suggestionsId}
        value={fieldValue}
        onChange={onChange}
        {...props}
      />
      {suggestionsId && currentSuggestions && (
        <datalist id={suggestionsId}>
          {currentSuggestions.map((s, i) => (
            <option key={i} value={s} />
          ))}
        </datalist>
      )}

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </div>
  );
}

export function TextAreaFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  label,
  description,
}: FormFieldProps<T> & TextFormFieldProps & TextareaProps) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <TextAreaFormItem
          fieldValue={field.value}
          onChange={(x) => field.onChange(x)}
          inputId={inputId}
          label={label}
          description={description}
          inForm={true}
        />
      )}
    />
  );
}

export function TextAreaFormItem<T extends FieldValues>({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inputId,
  inForm,
  ...props
}: TextareaProps & {
  fieldValue?: string;
  onChange?: (value?: T) => any;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  inputId?: string;
  inForm?: boolean;
}) {
  return (
    <div>
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}
      <FormControl>
        <Textarea
          id={inputId}
          value={fieldValue}
          onChange={onChange}
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
