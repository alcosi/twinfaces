import {FieldValues} from "react-hook-form";
import {Input, InputProps} from "@/components/base/input";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {Textarea, TextareaProps} from "@/components/base/textarea";
import {ReactNode} from "react";
import {FormFieldProps} from "./form-fields-common";

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
                              fieldValue={field.value} onChange={x => field.onChange(x)}
                              inputId={inputId} label={label} description={description} suggestions={suggestions}/>
                      }}/>
}

export function TextFormItem<T extends FieldValues>(
    {
        fieldValue,
        onChange,
        label,
        description,
        suggestions,
        inputId,
        ...props
    }: TextFormFieldProps & InputProps & {
        fieldValue?: string,
        onChange?: (value?: T) => any,
        label?: ReactNode,
        description?: ReactNode,
        required?: boolean,
        inputId?: string
    }) {
    let currentSuggestions = undefined;
    if (suggestions) {
        const value = fieldValue?.toLowerCase();
        currentSuggestions = value ? suggestions.filter(s => s.toLowerCase().includes(value)) : suggestions;
    }
    const suggestionsId = inputId ? `${inputId}-suggestions` : undefined;

    return <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
            <Input id={inputId} list={suggestionsId} value={fieldValue} onChange={onChange}
                   {...props} />
        </FormControl>
        {currentSuggestions && <datalist id={suggestionsId}>
            {currentSuggestions.map((s, i) => <option key={i} value={s}/>)}
        </datalist>}
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage/>
    </FormItem>
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
                          <FormItem>
                              {label && <FormLabel>{label}</FormLabel>}
                              <FormControl>
                                  <Textarea id={idPrefix && inputId} placeholder={placeholder} {...field} {...props} />
                              </FormControl>
                              {description && <FormDescription>{description}</FormDescription>}
                              <FormMessage/>
                          </FormItem>
                      )}/>
}