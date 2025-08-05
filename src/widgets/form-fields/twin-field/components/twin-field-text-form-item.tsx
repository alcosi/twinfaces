"use client";

import { RichTextEditorFormItem, TextFormItem } from "@/components/form-fields";

import { TwinClassFieldDescriptorTextV1 } from "@/entities/twinField";

type TwinFieldTextFormItemProps = {
  fieldValue: string;
  descriptor: TwinClassFieldDescriptorTextV1;
  onChange?: (value: string) => void;
};

export function TwinFieldTextFormItem({
  descriptor,
  onChange,
  ...props
}: TwinFieldTextFormItemProps) {
  switch (descriptor.editorType) {
    case "MARKDOWN_GITHUB":
    case "MARKDOWN_BASIC":
      return <RichTextEditorFormItem onChange={onChange} {...props} />;

    case "PLAIN":
    default:
      return (
        <TextFormItem onChange={(e) => onChange?.(e.target.value)} {...props} />
      );
  }
}
