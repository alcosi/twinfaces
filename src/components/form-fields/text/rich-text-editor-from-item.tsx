"use client";

import { RichTextEditor } from "@/features/editors";
import { FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "..";
import { FormItemProps } from "../types";

type RichTextEditorFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (value: string) => void;
};

export function RichTextEditorFormItem({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inForm,
}: RichTextEditorFormItemProps) {
  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-error-500">*</span>}
        </FormItemLabel>
      )}

      <RichTextEditor
        mode="html"
        initialHTML={fieldValue}
        onHtmlChange={onChange}
      />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}

      {inForm && <FormMessage />}
    </FormItem>
  );
}
