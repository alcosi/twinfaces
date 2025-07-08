import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";

import { ComboboxFormField, FormFieldProps } from "@/components/form-fields";

import { FeaturerParam, useFeaturerSelectAdapter } from "@/entities/featurer";
import { isPopulatedArray } from "@/shared/libs";

import { FeaturerFieldProps } from "../types";
import { FeaturerParamFormField } from "./featurer-param/featurer-param-form";

type Props<T extends FieldValues> = FormFieldProps<T> & FeaturerFieldProps;

export function FeaturerFormField<T extends FieldValues>({
  typeId,
  name,
  control,
  label,
  description,
  required,
  ...props
}: Props<T>) {
  const methods = useFormContext();
  const featureIdWatched = useWatch({ control, name });
  const featurerAdapter = useFeaturerSelectAdapter(typeId);

  const featurerParams: FeaturerParam[] = isPopulatedArray(featureIdWatched)
    ? featureIdWatched[0].params
    : [];

  return (
    <>
      <ComboboxFormField
        control={control}
        name={name}
        label={label}
        description={description}
        required={required}
        selectPlaceholder="Select featurer"
        searchPlaceholder="Search featurer..."
        noItemsText="No featurers found"
        onSelect={(_) => {
          methods.unregister(props.paramsFieldName);
        }}
        {...featurerAdapter}
      />

      {isPopulatedArray(featurerParams) && (
        <fieldset className="rounded-md border border-dashed px-1.5 py-2.5">
          <legend className="text-sm font-medium italic">Params</legend>
          <div className="space-y-2">
            {featurerParams.map((param) => (
              <FeaturerParamFormField
                key={param.key}
                name={`${props.paramsFieldName}.${param.key!}` as Path<T>}
                control={control}
                label={param.name}
                param={param}
              />
            ))}
          </div>
        </fieldset>
      )}
    </>
  );
}
