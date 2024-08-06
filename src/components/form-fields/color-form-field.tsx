import {FieldValues} from "react-hook-form";
import {FormFieldProps} from "@/components/form-fields/form-fields-common";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {ColorPicker} from "@/components/base/color-picker";
import {Component, ReactNode} from "react";


export function ColorPickerFormField<T extends FieldValues>({
                                                                name,
                                                                control,
                                                                label,
                                                                description
                                                            }: FormFieldProps<T>) {
    return <FormField control={control} name={name}
                      render={({field}) => (
                          <ColorPickerFormItem
                              label={label}
                              description={description}
                              fieldValue={field.value}
                              onChange={field.onChange}
                          />
                      )}/>
}

export class ColorPickerFormItem extends Component<{
    fieldValue: string,
    onChange?: (value: string) => any,
    label?: ReactNode,
    description?: ReactNode,
    required?: boolean
}> {
    render() {
        let {
            fieldValue,
            onChange,
            label,
            description
        } = this.props;
        return <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
                <ColorPicker value={fieldValue} onChange={onChange}/>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage/>
        </FormItem>
    }
}