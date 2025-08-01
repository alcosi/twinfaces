"use client";

import { RichTextEditor } from "@/features/editors";
import { FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "..";
import { FormItemProps } from "../types";

type RichTextEditorFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (event: { target: { markdown: string } }) => void;
  label?: string;
  description?: string;
  required?: boolean;
};

export const RichTextEditorFormItem = ({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inForm,
}: RichTextEditorFormItemProps) => {
  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}

      <RichTextEditor
        initialHTML={fieldValue}
        onHtmlChange={(html) => {
          onChange?.({ target: { markdown: html } });
        }}
      />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}

      {inForm && <FormMessage />}
    </FormItem>
  );
};
