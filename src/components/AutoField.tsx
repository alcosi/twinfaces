import {useEffect} from "react";
import {FormControl, FormDescription, FormItem, FormLabel} from "@/components/base/form";
import {Checkbox} from "@/components/base/checkbox";
import {Input} from "@/components/base/input";
import {Control, FieldPath} from "react-hook-form";
import {TextFormField, TextFormItem} from "@/components/form-fields/text-form-field";
import {
    ComboboxFormField,
    ComboboxFormFieldProps,
    ComboboxFormItem
} from "@/components/form-fields/combobox-form-field";
import {ComboboxProps} from "@/components/base/combobox";
import {CheckboxFormField} from "@/components/form-fields/checkbox-form-field";


export enum AutoFormValueType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    uuid = 'uuid',
    combobox = 'combobox',
    featurer = 'featurer',
    select = 'select',
}

export type AutoFormValueInfo =
    AutoFormCommonInfo
    & (AutoFormSimpleValueInfo | AutoFormComboboxValueInfo | AutoFormFeaturerValueInfo | AutoFormSelectValueInfo)

export interface AutoFormCommonInfo {
    label: string
    description?: string
}

export interface AutoFormSimpleValueInfo {
    type: AutoFormValueType.string | AutoFormValueType.boolean | AutoFormValueType.number | AutoFormValueType.uuid
}

export interface AutoFormComboboxValueInfo extends ComboboxFormFieldProps<any>, ComboboxProps<any> {
    type: AutoFormValueType.combobox,
    // TODO combobox value type
}

export interface AutoFormFeaturerValueInfo {
    type: AutoFormValueType.featurer,

}

export interface AutoFormSelectValueInfo {
    type: AutoFormValueType.select,
    options: string[]
}

export interface AutoFormFieldProps {
    info: AutoFormValueInfo
    value?: any,
    onChange?: (value: any) => any,
    name?: FieldPath<any>;
    control?: Control<any>;
}

export function AutoField({info, value, onChange, name, control}: AutoFormFieldProps) {
    function setValue(newValue: any) {
        onChange?.(newValue);
    }

    // boolean has a different structure (label after control), so we need to handle it separately
    if (info.type === AutoFormValueType.boolean) {
        return name && control ?
            <CheckboxFormField {...info} name={name} control={control}/> :
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                    <Checkbox
                        checked={value} className={'ml-3'}
                        onCheckedChange={newChecked => setValue(newChecked)}/>
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>{info.label}</FormLabel>
                    {info.description && <FormDescription>{info.description}</FormDescription>}
                </div>
            </FormItem>
    } else if (info.type === AutoFormValueType.combobox) {
        console.log('Combobox', info, value, onChange)
        return name && control ?
            <ComboboxFormField name={name} control={control} {...info}/>
            : <ComboboxFormItem value={value} onChange={onChange} description={info.description} {...info}/>
    } else {
        return name && control ? <TextFormField {...info} name={name} control={control}/> :
            <TextFormItem {...info} value={value} onChange={(e) => setValue(e?.target.value)}/>
    }

    // function renderInput() {
    //     switch (info.type) {
    //         // TODO Support other parameter types
    //         case AutoFormValueType.string:
    //         default:
    //             return <>
    //                 {name && control ?
    //                     <TextFormField name={name} control={control}/> :
    //                     <Input value={value} onChange={(e) => setValue(e.target.value)}/>
    //                 }
    //             </>
    //     }
    // }
    //
    // return <FormItem>
    //     <FormLabel>{info.label}</FormLabel>
    //     {renderInput()}
    //     {info.description && <FormDescription>{info.description}</FormDescription>}
    // </FormItem>
}