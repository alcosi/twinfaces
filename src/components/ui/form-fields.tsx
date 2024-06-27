import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Combobox, ComboboxProps} from "@/components/ui/combobox";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";
import {ColorPicker} from "@/components/ui/color-picker";

interface MyFormFieldProps<T extends FieldValues> {
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
                                                }: MyFormFieldProps<T>) {
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
                                                    }: MyFormFieldProps<T>) {
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
                                                    }: MyFormFieldProps<T>) {
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

export function ComboboxFormField<T extends FieldValues, K>({
                                                           name,
                                                           control,
                                                           label,
                                                           description,
                                                           buttonClassName,
                                                           ...props
                                                       }: MyFormFieldProps<T> & ComboboxProps<K>) {
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
                                                       }: MyFormFieldProps<T>) {
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