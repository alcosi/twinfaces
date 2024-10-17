import { FieldValues } from "react-hook-form";
import { FormFieldProps } from "@/components/form-fields/form-fields-common";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/base/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/select";

interface SelectFormFieldProps<T extends FieldValues, K>
  extends FormFieldProps<T> {
  placeholder?: string;
  values: K[];
  getItemKey: (item: K) => string;
  getItemLabel: (item: K) => string;
}

// TODO update to get value by id the same way as combobox
// TODO separate form item into separate component
export function SelectFormField<T extends FieldValues, K>({
  name,
  control,
  label,
  description,
  placeholder,
  values,
  getItemKey,
  getItemLabel,
}: SelectFormFieldProps<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {values.map((value) => (
                  <SelectItem key={getItemKey(value)} value={getItemKey(value)}>
                    {getItemLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
