import {FieldValues} from "react-hook-form";
import {Input, InputProps} from "@/components/base/input";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {Textarea, TextareaProps} from "@/components/base/textarea";
import {ReactNode} from "react";
import {FormFieldProps, FormItemDescription, FormItemLabel} from "./form-fields-common";
import {Label} from "@/components/base/label";
import {cn} from "@/lib/utils";
import * as React from "react";

export interface TextFormFieldProps {
    suggestions?: string[]
}

export function TextFormField<T extends FieldValues>({
                                                         name,
                                                         control,
                                                         idPrefix,
                                                         label,
                                                         description,
                                                         suggestions,
                                                         ...props
                                                     }: FormFieldProps<T> & TextFormFieldProps & InputProps) {
    const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
    return <FormField control={control} name={name}
                      render={({field}) => {
                          return <TextFormItem
                              autoFocus={name === 'key'}
                              fieldValue={field.value} onChange={x => field.onChange(x)}
                              inputId={inputId} label={label} description={description}
                              suggestions={suggestions} inForm={true}/>
                      }}/>
}

export function TextFormItem<T extends FieldValues>(
    {
        fieldValue,
        onChange,
        label,
        description,
        required,
        suggestions,
        inputId,
        inForm,
        ...props
    }: TextFormFieldProps & InputProps & {
        fieldValue?: string,
        onChange?: (value?: T) => any,
        label?: ReactNode,
        description?: ReactNode,
        required?: boolean,
        inputId?: string
        inForm?: boolean
    }) {
    let currentSuggestions = undefined;
    if (suggestions) {
        const value = fieldValue?.toLowerCase();
        currentSuggestions = value ? suggestions.filter(s => s.toLowerCase().includes(value)) : suggestions;
    }
    const suggestionsId = inputId ? `${inputId}-suggestions` : undefined;

    return <div>
        {label && <FormItemLabel inForm={inForm}>
            {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel> }
        <Input id={inputId} list={suggestionsId} value={fieldValue} onChange={onChange}
               {...props} />
        {suggestionsId && currentSuggestions && <datalist id={suggestionsId}>
            {currentSuggestions.map((s, i) => <option key={i} value={s}/>)}
        </datalist>}

        {description && <FormItemDescription inForm={inForm}>{description}</FormItemDescription>}
        {inForm && <FormMessage/>}
    </div>
}

export function TextAreaFormField<T extends FieldValues>({
                                                             name,
                                                             control,
                                                             idPrefix,
                                                             label,
                                                             placeholder,
                                                             description,
                                                             suggestions,
                                                             ...props
                                                         }: FormFieldProps<T> & TextFormFieldProps & TextareaProps) {
    const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <TextAreaFormItem
                              fieldValue={field.value} onChange={x => field.onChange(x)}
                              inputId={inputId} label={label} description={description} inForm={true}/>
                      )}/>
}

export function TextAreaFormItem<T extends FieldValues>(
    {
        fieldValue,
        onChange,
        label,
        description,
        required,
        inputId,
        inForm,
        ...props
    }: TextareaProps & {
        fieldValue?: string,
        onChange?: (value?: T) => any,
        label?: ReactNode,
        description?: ReactNode,
        required?: boolean,
        inputId?: string
        inForm?: boolean
    }) {

    return <div>
        {label && <FormItemLabel inForm={inForm}>
            {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel> }
        <FormControl>
            <Textarea id={inputId}value={fieldValue} onChange={onChange}
                      {...props} />
        </FormControl>

        {description && <FormItemDescription inForm={inForm}>{description}</FormItemDescription>}
        {inForm && <FormMessage/>}
    </div>
}