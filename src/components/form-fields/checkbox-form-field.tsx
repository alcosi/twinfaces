import {FieldValues} from "react-hook-form";
import {FormFieldProps} from "@/components/form-fields/form-fields-common";
import {FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/base/form";
import {Checkbox} from "@/components/base/checkbox";
import {ReactNode} from "react";


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

export function CheckboxFormItem({
                                     fieldValue,
                                     onChange,
                                     label,
                                     description
                                 }: {
    fieldValue?: boolean,
    onChange?: (value?: boolean) => any,
    label?: ReactNode,
    description?: ReactNode,
    required?: boolean,
    inputId?: string
}) {
    return <FormItem className="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
            <Checkbox
                checked={fieldValue}
                onCheckedChange={x => onChange?.(x === true)}
            />
        </FormControl>
        <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
        </div>
    </FormItem>
}
