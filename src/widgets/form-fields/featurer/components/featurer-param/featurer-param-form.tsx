import { FormFieldProps } from "@/components/form-fields/types";
import { FormField } from "@/shared/ui";
import { FieldValues } from "react-hook-form";
import {
  FeaturerParamFormItem,
  FeaturerParamFormItemProps,
} from "./featurer-param-item";

type Props<T extends FieldValues> = FormFieldProps<T> &
  FeaturerParamFormItemProps;

export function FeaturerParamFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: Props<T>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FeaturerParamFormItem
            fieldValue={field.value}
            onChange={field.onChange}
            {...props}
            inputId={inputId}
            inForm={true}
          />
        );
      }}
    />
  );
}
