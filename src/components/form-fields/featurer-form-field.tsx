import { FormField, FormItem, FormMessage } from "@/shared/ui/form";
import {
  FeaturerInput,
  FeaturerInputProps,
  FeaturerValue,
} from "@/components/featurer-input";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { cn } from "@/shared/libs";
import { ReactNode, useEffect } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";

export interface FeaturerFormFieldProps<TFormModel extends FieldValues>
  extends FeaturerInputProps {
  paramsName: Path<TFormModel>;
}

export function FeaturerFormField<TFormModel extends FieldValues>({
  name,
  paramsName,
  control,
  label,
  description,
  required,
  ...props
}: FormFieldProps<TFormModel> &
  FeaturerFormFieldProps<TFormModel> &
  Omit<FeaturerInputProps, "defaultId" | "defaultParams" | "onChange">) {
  const methods = useFormContext();
  const paramsField = methods.getValues(paramsName);

  useEffect(() => {
    control.register(paramsName);
  }, []);

  function onChange(value: FeaturerValue | null) {
    if (value) {
      // @ts-ignore
      methods.setValue(name, value.featurer.id);
      // @ts-ignore
      methods.setValue(paramsName, value.params);
    } else {
      // @ts-ignore
      methods.setValue(name, null);
      // @ts-ignore
      methods.setValue(paramsName, null);
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FeaturerFormItem
          fieldValue={field.value}
          paramsValue={paramsField}
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
  fieldValue,
  paramsValue,
  onChange,
  label,
  description,
  required,
  buttonClassName,
  inForm,
  ...props
}: Omit<FeaturerInputProps, "defaultId" | "defaultParams" | "onChange"> & {
  typeId: number;
  fieldValue?: number;
  paramsValue?: object;
  onChange?: (value: FeaturerValue | null) => any;
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
      <FeaturerInput
        typeId={typeId}
        defaultId={fieldValue}
        defaultParams={paramsValue}
        onChange={onChange}
        buttonClassName={cn("w-full", buttonClassName)}
        {...props}
      />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </FormItem>
  );
}
