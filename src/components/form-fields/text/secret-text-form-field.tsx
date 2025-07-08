import { useEffect, useState } from "react";
import { FieldValues, useWatch } from "react-hook-form";

import {
  PasswordStrengthLevel,
  checkPasswordStrength,
  isTruthy,
} from "@/shared/libs";
import { FormField, InputProps, StepsProgressBar } from "@/shared/ui";

import { FormFieldProps, TextFormFieldProps } from "../types";
import { SecretTextFormItem } from "./secret-text-form-item";

const strengthColorMap: Record<PasswordStrengthLevel, string> = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-yellow-500",
  3: "bg-green-500",
};

type SecretTextFormFieldProps<T extends FieldValues> = FormFieldProps<T> &
  TextFormFieldProps &
  Omit<InputProps, "onChange"> & {
    showStrengthIndicator?: boolean;
  };

export function SecretTextFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  showStrengthIndicator = false,
  ...props
}: SecretTextFormFieldProps<T>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  const [strengthLevel, setStrengthLevel] = useState<PasswordStrengthLevel>(0);

  const passwordWatched = useWatch({
    control: control,
    name: name,
  });

  useEffect(() => {
    setStrengthLevel(checkPasswordStrength(passwordWatched));
  }, [passwordWatched]);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState, formState }) => (
          <SecretTextFormItem
            type="password"
            autoFocus={props.autoFocus}
            fieldValue={field.value}
            onChange={(x) => field.onChange(x)}
            invalid={
              isTruthy(fieldState.error) || isTruthy(formState.errors.root)
            }
            inputId={inputId}
            inForm={true}
            {...props}
          />
        )}
      />
      {showStrengthIndicator && passwordWatched && (
        <StepsProgressBar
          steps={["0", "1", "2", "3"]}
          current={strengthLevel.toString()}
          activeColor={strengthColorMap[strengthLevel]}
          inactiveColor="bg-transparent"
        />
      )}
    </>
  );
}
