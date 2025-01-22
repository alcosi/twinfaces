import { FormControl, FormMessage } from "@/shared/ui";
import { Textarea, TextareaProps } from "@/shared/ui/textarea";
import { FieldValues } from "react-hook-form";
import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

export function TextAreaFormItem<T extends FieldValues>({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inputId,
  inForm,
  ...props
}: TextareaProps &
  FormItemProps & {
    fieldValue?: string;
    onChange?: (value?: T) => void;
    inputId?: string;
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
