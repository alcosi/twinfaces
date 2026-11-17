"use client";

import { Paperclip } from "lucide-react";

import { cn } from "@/shared/libs";
import { FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { RequiredMark } from "../required-mode";
import { FormItemProps } from "../types";

export function FileFormItem({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inputId,
  inForm,
  invalid,
  accept,
}: FormItemProps & {
  fieldValue?: File | null;
  onChange: (file: File | undefined) => void;
  inputId?: string;
  invalid?: boolean;
  accept?: string;
}) {
  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} <RequiredMark required={required} />
        </FormItemLabel>
      )}
      <label
        htmlFor={inputId}
        className={cn(
          "border-input bg-background hover:bg-muted/50 text-foreground flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
          !fieldValue && "text-muted-foreground",
          invalid && "border-destructive"
        )}
      >
        <Paperclip className="h-4 w-4 shrink-0" />
        <span className="truncate">{fieldValue?.name ?? "Select file..."}</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          onChange(event.target.files?.[0]);
          // reset so picking the same file again fires onChange
          event.target.value = "";
        }}
      />
      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </FormItem>
  );
}
