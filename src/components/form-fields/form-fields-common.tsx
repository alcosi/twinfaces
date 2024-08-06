import {Control, FieldPath, FieldValues} from "react-hook-form";
import {ReactNode} from "react";

export interface FormFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    idPrefix?: string,
    label?: ReactNode;
    placeholder?: string;
    description?: ReactNode;
    required?: boolean;
}