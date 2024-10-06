import { FieldValues } from "react-hook-form";
import { FormFieldProps } from "@/components/form-fields/form-fields-common";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/form";
import { MultiSelect } from "@/components/base/multi-select";

interface MultiSelectFormFieldProps<T extends FieldValues, K> extends FormFieldProps<T> {
    placeholder?: string;
    values: K[];
    getItemKey: (item: K) => string;
    getItemLabel: (item: K) => string;
}

export function MultiSelectFormField<T extends FieldValues, K>({
    name,
    control,
    label,
    description,
    placeholder,
    values,
    getItemKey,
    getItemLabel
}: MultiSelectFormFieldProps<T, K>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <MultiSelect
                            options={values.map((value) => ({
                                label: getItemLabel(value),
                                value: getItemKey(value),
                            }))}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            placeholder={placeholder}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
