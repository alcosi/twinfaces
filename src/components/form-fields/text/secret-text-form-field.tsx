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
  0: "bg-error",
  1: "bg-warn",
  2: "bg-warn-bg",
  3: "bg-success",
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
              isTruthy(formState.errors.root?.message) || fieldState.invalid
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
