import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export type FormItemProps = {
  inputId?: string;
  inForm?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
};

export interface FormFieldProps<T extends FieldValues>
  extends Pick<FormItemProps, "label" | "description" | "required"> {
  name: FieldPath<T>;
  control: Control<T>;
  idPrefix?: string;
  placeholder?: string;
}

export interface TextFormFieldProps {
  suggestions?: string[];
  error?: string | null;
}
