import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ReactNode } from "react";
import { FormDescription, FormLabel } from "@/components/base/form";
import { Label } from "@/components/base/label";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  idPrefix?: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  required?: boolean;
}

export function FormItemLabel({
  children,
  inForm,
}: {
  children: ReactNode;
  inForm?: boolean;
}) {
  return inForm ? <FormLabel>{children}</FormLabel> : <Label>{children}</Label>;
}

export function FormItemDescription({
  children,
  inForm,
}: {
  children: ReactNode;
  inForm?: boolean;
}) {
  return inForm ? (
    <FormDescription>{children}</FormDescription>
  ) : (
    <p className={cn("text-sm text-muted-foreground")}>{children}</p>
  );
}
