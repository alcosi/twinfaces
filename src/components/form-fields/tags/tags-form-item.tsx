import { isArray, isPopulatedString } from "@/shared/libs";
import {
  FormControl,
  FormMessage,
  TagBox,
  TagBoxHandle,
  TagBoxProps,
} from "@/shared/ui";
import { useEffect, useRef } from "react";
import { FormItemProps } from "../types";
import { FormItemDescription, FormItemLabel } from "../form-items-common";

export function TagsFormItem<TField>({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inputId,
  inForm,
  ...props
}: TagBoxProps<TField> &
  FormItemProps & {
    fieldValue?: TField[];
    onChange?: (value?: TField[]) => void;
    inputId?: string;
  }) {
  const tagboxRef = useRef<TagBoxHandle<TField> | null>(null);

  useEffect(() => {
    if (isArray(fieldValue)) {
      tagboxRef.current?.set([...fieldValue]);
    } else if (isPopulatedString(fieldValue)) {
      tagboxRef.current?.set([fieldValue]);
    }
  }, []);

  return (
    <div>
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}
      <FormControl>
        <TagBox<TField>
          ref={tagboxRef}
          id={inputId}
          initialTags={fieldValue}
          onTagsChange={(tags) => {
            onChange?.(tags);
          }}
          {...props}
        />
      </FormControl>

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </div>
  );
}
