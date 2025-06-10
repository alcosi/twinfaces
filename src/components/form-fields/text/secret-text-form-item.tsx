import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, useState } from "react";

import { Button, FormItem, FormMessage, Input } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

type SecretTextFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type: string;
};

export const SecretTextFormItem = ({
  fieldValue,
  onChange,
  label,
  description,
  required,
  inForm,
  type,
  ...props
}: SecretTextFormItemProps) => {
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const toggleVisibility = () => setShowSecret((prev) => !prev);

  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel inForm={inForm}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}

      <div className="relative">
        <Input
          value={fieldValue ?? ""}
          onChange={onChange}
          type={type === "password" ? (showSecret ? "text" : "password") : type}
          {...props}
        />
        <Button
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
