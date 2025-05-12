"use client";

import { ChangeEvent } from "react";

import { MarkdownEditorFormItem, TextFormItem } from "@/components/form-fields";

import { TwinClassFieldDescriptorTextV1 } from "@/entities/twinField";

type TwinFieldTextFormItemProps = {
  descriptor: TwinClassFieldDescriptorTextV1;
  onTextChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onMarkdownChange?: (event: { target: { markdown: string } }) => void;
} & { fieldValue: string };

export function TwinFieldTextFormItem({
  descriptor,
  onTextChange,
  onMarkdownChange,
  ...props
}: TwinFieldTextFormItemProps) {
  switch (descriptor.editorType) {
    case "MARKDOWN_GITHUB":
    case "MARKDOWN_BASIC":
      return <MarkdownEditorFormItem onChange={onMarkdownChange} {...props} />;

    case "PLAIN":
    default:
      return <TextFormItem onChange={onTextChange} {...props} />;
  }
}
