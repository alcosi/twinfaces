import {ControllerRenderProps, FieldValues, Path} from "react-hook-form";
import {FormFieldProps, FormItemDescription, FormItemLabel} from "@/components/form-fields/form-fields-common";
import {Combobox, ComboboxHandle, ComboboxProps} from "@/components/base/combobox";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {ReactNode, useEffect, useRef} from "react";
import {cn} from "@/lib/utils";
import * as React from "react";

export interface ComboboxFormFieldProps<T> {
    getById: (id: string) => Promise<T | undefined>;
}

export function ComboboxFormField<TFormModel extends FieldValues, TFieldModel>(
    {
        name,
        control,
        label,
        description,
        required,
        buttonClassName,
        ...props
    }: FormFieldProps<TFormModel> & ComboboxFormFieldProps<TFieldModel> & ComboboxProps<TFieldModel>) {
    return <FormField control={control} name={name}
                      render={({field}) => <ComboboxFormItem
                          label={label}
                          description={description}
                          required={required}
                          buttonClassName={buttonClassName}
                          onChange={(val) => field.onChange(val && props.getItemKey(val))}
                          fieldValue={field.value}
                          inForm={true}
                          {...props}
                      />}
    />
}

export function ComboboxFormItem<TFieldModel>(
    {
        fieldValue,
        onChange,
        getById,
        label,
        description,
        required,
        buttonClassName,
        inForm,
        ...props
    }: ComboboxProps<TFieldModel> & ComboboxFormFieldProps<TFieldModel> & {
        fieldValue?: string,
        onChange?: (value?: TFieldModel) => any,
        label?: ReactNode,
        description?: ReactNode,
        required?: boolean
        inForm?: boolean
    }) {
    const comboboxRef = useRef(null);

    useEffect(() => {
        setValueByKey(fieldValue).catch(e => {
            console.error('failed to set combobox field value by key', e)
        })
    }, [fieldValue])

    async function setValueByKey(id?: string) {
        if (!id) {
            console.log('setting id to null');
            (comboboxRef.current as unknown as ComboboxHandle<TFieldModel>).setSelected(undefined);
            return;
        }
        try {
            const selected = (comboboxRef.current as unknown as ComboboxHandle<TFieldModel>).getSelected();
            console.log('current selected', selected)
            if (!selected || props.getItemKey(selected) !== id) {
                console.log('searching combobox field value by id')
                const value = await getById(id);
                (comboboxRef.current as unknown as ComboboxHandle<TFieldModel>).setSelected(value);
                console.log('found combobox field value by id', value, selected)
            }
        } catch (e) {
            console.error('failed to search combobox field value by id', e)
        }
    }

    // function onChange(val?: TFieldModel) {
    //     field.onChange(val && props.getItemKey(val));
    // }

    return <FormItem>
        {label && <FormItemLabel>
            {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>}
        <FormControl>
            <div>
                <Combobox<TFieldModel>
                    ref={comboboxRef}
                    onSelect={onChange}
                    buttonClassName={cn(["w-full", buttonClassName])}
                    {...props}/>
            </div>
        </FormControl>
        {description && <FormItemDescription inForm={inForm}>{description}</FormItemDescription>}
        {inForm && <FormMessage/>}
    </FormItem>
}