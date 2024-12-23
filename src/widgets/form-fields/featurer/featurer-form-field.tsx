import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { FeaturerValue } from "@/entities/featurer";
import { isPopulatedString } from "@/shared/libs";
import { FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { ReactNode } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { z } from "zod";
import { FeaturerInput } from "./featurer-input";
import { FeaturerInputProps } from "./types";

interface TFeaturerFormModel extends FieldValues {
  // TODO: Replace `any` with the correct form model type.
  [key: string]: any;
  // [key: string]: { id?: number; params?: FeaturerParams } | null;
}

export interface FeaturerFormFieldProps extends FeaturerInputProps {}

export function FeaturerFormField<TFormModel extends TFeaturerFormModel>({
  name,
  control,
  label,
  description,
  required,
  ...props
}: FormFieldProps<TFormModel> &
  FeaturerFormFieldProps &
  Omit<FeaturerInputProps, "defaultId" | "defaultParams" | "onChange">) {
  const methods = useFormContext();

  function validateParams(params: FeaturerValue["params"]): string | null {
    for (const property in params) {
      const param = params[property];

      // TODO: SUPPORT other params
      if (isPopulatedString(param?.value)) {
        if (param?.type === "UUID:TWINS_DATA_LIST_ID") {
          const { success, error } = z
            .string()
            .uuid("Please enter a valid UUID")
            .safeParse(param.value);

          if (!success) {
            return `${property}: ${error.errors[0]?.message}`;
          }
        }
      }
    }

    return null;
  }

  function onChange(value: FeaturerValue | null) {
    methods.clearErrors();

    const error = validateParams(value?.params ?? {});

    if (isPopulatedString(error)) {
      methods.setError(name, { message: error });
    }

    methods.setValue(
      name,
      // TODO: Replace `any` with the appropriate type for `value` to ensure type safety.
      value ? ({ id: value.featurer?.id, params: value.params } as any) : null
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FeaturerFormItem
          onChange={onChange}
          label={label}
          description={description}
          required={required}
          inForm={true}
          {...props}
        />
      )}
    />
  );
}

export function FeaturerFormItem({
  typeId,
  onChange,
  label,
  description,
  required,
  inForm,
  ...props
}: Omit<FeaturerInputProps, "onChange"> & {
  typeId: number;
  onChange?: (value: FeaturerValue | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  inForm?: boolean;
}) {
  return (
    <FormItem>
      {label && (
        <FormItemLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}
      <FeaturerInput typeId={typeId} onChange={onChange} {...props} />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </FormItem>
  );
}
