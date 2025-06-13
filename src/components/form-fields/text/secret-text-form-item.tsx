import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent } from "react";

import { useToggle } from "@/shared/libs";
import { Button, FormItem, FormMessage, Input } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

type SecretTextFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type: string;
  inputId?: string;
};

export const SecretTextFormItem = ({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inForm,
  type,
  inputId,
  ...props
}: SecretTextFormItemProps) => {
  const [showSecret, toggleVisibility] = useToggle(false);

  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-destructive">*</span>}
        </FormItemLabel>
      )}

      <div className="relative">
        <Input
          id={inputId}
          value={fieldValue ?? ""}
          onChange={onChange}
          type={type === "password" ? (showSecret ? "text" : "password") : type}
          className="pr-15"
          {...props}
        />
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            toggleVisibility();
          }}
          IconComponent={showSecret ? EyeOff : Eye}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        />
      </div>

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}

      {inForm && <FormMessage />}
    </FormItem>
  );
};
