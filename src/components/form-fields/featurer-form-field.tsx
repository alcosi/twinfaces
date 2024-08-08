import {FieldValues, Path, PathValue, useFormContext} from "react-hook-form";
import {FormFieldProps} from "@/components/form-fields/form-fields-common";
import {ComboboxProps} from "@/components/base/combobox";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {ComboboxFormItem} from "@/components/form-fields/combobox-form-field";
import {FeaturerInput, FeaturerInputProps, FeaturerValue} from "@/components/FeaturerInput";
import {ReactNode, useEffect} from "react";
import {cn} from "@/lib/utils";

export interface FeaturerFormFieldProps<TFormModel extends FieldValues> extends FeaturerInputProps {
    paramsName: Path<TFormModel>;

}

export function FeaturerFormField<TFormModel extends FieldValues>(
    {
        name,
        paramsName,
        control,
        label,
        description,
        required,
        ...props
    }: FormFieldProps<TFormModel> & FeaturerFormFieldProps<TFormModel> &
        Omit<FeaturerInputProps, 'defaultId' | 'defaultParams' | 'onChange'>) {
    console.log(control._fields)
    const methods = useFormContext()
    const paramsField = methods.getValues(paramsName)

    useEffect(() => {
        control.register(paramsName)
    }, [])

    function onChange(value: FeaturerValue | null) {
        if (value) {
            // @ts-ignore
            methods.setValue(name, value.featurer.id)
            // @ts-ignore
            methods.setValue(paramsName, value.params)
        } else {
            // @ts-ignore
            methods.setValue(name, null)
            // @ts-ignore
            methods.setValue(paramsName, null)
        }
    }

    return <FormField control={control} name={name}
                      render={({field}) => <FeaturerFormItem
                          fieldValue={field.value}
                          paramsValue={paramsField}
                          onChange={onChange}
                          label={label}
                          description={description}
                          required={required}
                          {...props}
                      />}
    />
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
                              ...props
                          }: Omit<FeaturerInputProps, 'defaultId' | 'defaultParams' | 'onChange'> & {
    typeId: number,
    fieldValue?: number,
    paramsValue?: object
    onChange?: (value: FeaturerValue | null) => any,
    label?: ReactNode,
    description?: ReactNode,
    required?: boolean,
}) {
    return <FormItem>
        {label && <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>}
        <FeaturerInput
            typeId={typeId}
            defaultId={fieldValue}
            defaultParams={paramsValue}
            onChange={onChange}
            buttonClassName={cn('w-full', buttonClassName)}
            {...props}
        />
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage/>
    </FormItem>
    // return <FormItem>
    {/*{label && <FormLabel>*/
    }
    {/*    {label} {required && <span className="text-red-500">*</span>}*/
    }
    {/*</FormLabel>}*/
    }
    {/*<FormControl>*/
    }
    {/*<div>*/
    }
    // <FeaturerInput
    //     typeId={typeId}
    //     defaultId={fieldValue}
    //     defaultParams={paramsValue}
    //     onChange={onChange}
    // />
    {/*</div>*/
    }
    {/*</FormControl>*/
    }
    {/*{description && <FormDescription>{description}</FormDescription>}*/
    }
    {/*<FormMessage/>*/
    }
    /*</FormItem>*/
}