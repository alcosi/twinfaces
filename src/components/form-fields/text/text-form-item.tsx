import { FormMessage } from "@/shared/ui";
import { Input, InputProps } from "@/shared/ui/input";
import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps, TextFormFieldProps } from "../types";

export function TextFormItem({
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
  FormItemProps &
  InputProps & {
    fieldValue?: string;
    inputId?: string;
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
