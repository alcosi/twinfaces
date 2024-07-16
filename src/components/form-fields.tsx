import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {Input} from "@/components/base/input";
import {Textarea} from "@/components/base/textarea";
import {Checkbox} from "@/components/base/checkbox";
import {Combobox, ComboboxProps} from "@/components/base/combobox";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";
import {ColorPicker} from "@/components/base/color-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/base/select";

export interface FormFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label?: ReactNode;
    placeholder?: string;
    description?: ReactNode;
}

export function TextFormField<T extends FieldValues>({
                                                         name,
                                                         control,
                                                         label,
                                                         placeholder,
                                                         description
                                                     }: FormFieldProps<T>) {
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <FormItem>
                              {label && <FormLabel>{label}</FormLabel>}
                              <FormControl>
                                  <Input placeholder={placeholder} {...field}/>
                              </FormControl>
                              {description && <FormDescription>{description}</FormDescription>}
                              <FormMessage/>
                          </FormItem>
                      )}/>
}

export function TextAreaFormField<T extends FieldValues>({
                                                             name,
                                                             control,
                                                             label,
                                                             placeholder,
                                                             description
                                                         }: FormFieldProps<T>) {
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <FormItem>
                              {label && <FormLabel>{label}</FormLabel>}
                              <FormControl>
                                  <Textarea placeholder={placeholder} {...field} />
                              </FormControl>
                              {description && <FormDescription>{description}</FormDescription>}
                              <FormMessage/>
                          </FormItem>
                      )}/>
}

export function CheckboxFormField<T extends FieldValues>({
                                                             name,
                                                             control,
                                                             label,
                                                             description
                                                         }: FormFieldProps<T>) {
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                  <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                  {label && <FormLabel>{label}</FormLabel>}
                                  {description && <FormDescription>{description}</FormDescription>}
                              </div>
                          </FormItem>
                      )}/>
}

interface SelectFormFieldProps<T extends FieldValues, K> extends FormFieldProps<T> {
    placeholder?: string;
    values: K[];
    getItemKey: (item: K) => string;
    getItemLabel: (item: K) => string;
}

export function SelectFormField<T extends FieldValues, K>({
                                                              name,
                                                              control,
                                                              label,
                                                              description,
                                                              placeholder,
                                                              values,
                                                              getItemKey,
                                                              getItemLabel
                                                          }: SelectFormFieldProps<T, K>) {
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <FormItem>
                              {label && <FormLabel>{label}</FormLabel>}
                              <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder={placeholder}/>
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
                              <FormMessage/>
                          </FormItem>
                      )}/>
}

export function ComboboxFormField<T extends FieldValues, K>({
                                                                name,
                                                                control,
                                                                label,
                                                                description,
                                                                buttonClassName,
                                                                ...props
                                                            }: FormFieldProps<T> & ComboboxProps<K>) {
    return <FormField control={control} name={name}
                      render={({field}) => {
                          return (
                              <FormItem>
                                  {label && <FormLabel>{label}</FormLabel>}
                                  <FormControl>
                                      <div>
                                          <Combobox onSelect={(val) => field.onChange(val && props.getItemKey(val))}
                                                    buttonClassName={cn(["w-full", buttonClassName])}
                                                    {...props}/>
                                      </div>
                                  </FormControl>
                                  {description && <FormDescription>{description}</FormDescription>}
                                  <FormMessage/>
                              </FormItem>
                          );
                      }}/>
}

export function ColorPickerFormField<T extends FieldValues>({
                                                                name,
                                                                control,
                                                                label,
                                                                description
                                                            }: FormFieldProps<T>) {
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <FormItem>
                              {label && <FormLabel>{label}</FormLabel>}
                              <FormControl>
                                  <ColorPicker {...field}/>
                                  {/*<Input type="color" {...field}/>*/}
                              </FormControl>
                              {description && <FormDescription>{description}</FormDescription>}
                              <FormMessage/>
                          </FormItem>
                      )}/>
}