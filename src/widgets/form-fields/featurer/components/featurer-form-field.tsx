import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormItem } from "@/components/complex-combobox";
import { FormFieldProps } from "@/components/form-fields";

import {
  FeaturerParam,
  useFeaturerFilters,
  useFeaturerSelectAdapterWithFilters,
} from "@/entities/featurer";
import { isPopulatedArray } from "@/shared/libs";
import { FormField } from "@/shared/ui";

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
  const featurerAdapter = useFeaturerSelectAdapterWithFilters(typeId);
  const { buildFilterFields, mapFiltersToPayload } = useFeaturerFilters();

  const featurerParams: FeaturerParam[] = isPopulatedArray(featureIdWatched)
    ? featureIdWatched[0].params
    : [];

  const featurerInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label,
    description,
    adapter: featurerAdapter,
    extraFilters: buildFilterFields(),
    mapExtraFilters: (filters) => mapFiltersToPayload(filters),
    selectPlaceholder: props.selectPlaceholder ?? "Select featurer",
    searchPlaceholder: props.searchPlaceholder ?? "Search featurer...",
    noItemsText: props.noItemsText ?? "No featurers found",
  };

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <ComplexComboboxFormItem
            value={field.value}
            onChange={(value) => {
              // Params belong to the previously picked featurer — drop them so
              // the new one starts from its own set.
              methods.unregister(props.paramsFieldName);
              field.onChange(value);
            }}
            info={featurerInfo}
            inForm
            required={required}
            filterKey={name}
          />
        )}
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
