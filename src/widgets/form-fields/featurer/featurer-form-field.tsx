import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { FeaturerValue } from "@/entities/featurer";
import { FormFieldValidationError, isPopulatedArray } from "@/shared/libs";
import { FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { ReactNode } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { FeaturerInput } from "./featurer-input";
import { validateParamTypes } from "./helpers";
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

  function onChange(value: FeaturerValue | null) {
    methods.clearErrors();

    const { errors } = validateParamTypes(value?.params ?? {});
    if (isPopulatedArray<FormFieldValidationError>(errors)) {
      const { key, message } = errors[0];
      methods.setError(name, { message: `${key}: ${message}` });
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
