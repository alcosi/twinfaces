"use client";

import { ChangeEvent } from "react";

import { RichTextEditor } from "@/features/editors";
import { FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "..";
import { FormItemProps } from "../types";

type RichTextEditorFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function RichTextEditorFormItem({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inForm,
}: RichTextEditorFormItemProps) {
  function handleOnHtmlChange(html: string) {
    const syntheticEvent = {
      target: { value: html },
      currentTarget: { value: html },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  }

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
        onHtmlChange={handleOnHtmlChange}
      />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}

      {inForm && <FormMessage />}
    </FormItem>
  );
}
