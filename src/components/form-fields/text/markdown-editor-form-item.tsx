"use client";

import { MarkdownEditor } from "@/features/markdown";
import { FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "..";
import { RequiredMark } from "../required-mode";
import { FormItemProps } from "../types";

type MarkdownEditorFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (event: { target: { markdown: string } }) => void;
  label?: string;
  description?: string;
  required?: boolean;
};

export function MarkdownEditorFormItem({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inForm,
}: MarkdownEditorFormItemProps) {
  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} <RequiredMark required={required} />
        </FormItemLabel>
      )}

      <MarkdownEditor markdown={fieldValue} onChange={onChange} />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}

      {inForm && <FormMessage />}
    </FormItem>
  );
}
