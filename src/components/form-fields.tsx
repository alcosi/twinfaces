import {Control, ControllerRenderProps, FieldPath, FieldValues, Path} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {Input, InputProps} from "@/components/base/input";
import {Textarea, TextareaProps} from "@/components/base/textarea";
import {Checkbox} from "@/components/base/checkbox";
import {Combobox, ComboboxHandle, ComboboxProps} from "@/components/base/combobox";
import {cn} from "@/lib/utils";
import {ReactNode, useEffect, useRef} from "react";
import {ColorPicker} from "@/components/base/color-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/base/select";

export interface FormFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    idPrefix?: string,
    label?: ReactNode;
    placeholder?: string;
    description?: ReactNode;
    required?: boolean;
}

export interface TextFormFieldProps {
    suggestions?: string[]
}

export function TextFormField<T extends FieldValues>({
                                                         name,
                                                         control,
                                                         idPrefix,
                                                         label,
                                                         placeholder,
                                                         description,
                                                         suggestions,
                                                         ...props
                                                     }: FormFieldProps<T> & TextFormFieldProps & InputProps) {
    const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
    return <FormField control={control} name={name}
                      render={({field}) => {
                          let currentSuggestions = undefined;
                          if (suggestions) {
                              const value = field.value?.toLowerCase();
                              currentSuggestions = value ? suggestions.filter(s => s.toLowerCase().includes(value)) : suggestions;
                          }
                          const suggestionsId = idPrefix ? `${idPrefix}-${name}-suggestions` : undefined;

                          return <FormItem>
                              {label && <FormLabel>{label}</FormLabel>}
                              <FormControl>
                                  <Input id={idPrefix && inputId} list={suggestionsId}
                                         placeholder={placeholder} {...field} {...props} />
                              </FormControl>
                              {currentSuggestions && <datalist id={suggestionsId} >
                                  {currentSuggestions.map((s, i) => <option key={i} value={s}/>)}
                              </datalist>}
                              {description && <FormDescription>{description}</FormDescription>}
                              <FormMessage/>
                          </FormItem>
                      }}/>
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


// TODO update to get value by id the same way as combobox
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

interface ComboboxFormFieldProps<T> {
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
                      render={({field}) => <ComboboxFieldRender
                          field={field}
                          label={label}
                          description={description}
                          required={required}
                          buttonClassName={buttonClassName}
                          {...props}
                      />}
    />
}

function ComboboxFieldRender<TFormModel extends FieldValues, TFieldModel>(
    {
        field,
        getById,
        label,
        description,
        required,
        buttonClassName,
        ...props
    }: ComboboxProps<TFieldModel> & ComboboxFormFieldProps<TFieldModel> & {
        field: ControllerRenderProps<TFormModel, Path<TFormModel>>,
        label?: ReactNode,
        description?: ReactNode,
        required?: boolean
    }) {
    const comboboxRef = useRef(null);

    useEffect(() => {
        setValueByKey(field.value).catch(e => {
            console.error('failed to set combobox field value by key', e)
        })
    }, [field.value])

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

    function onChange(val?: TFieldModel) {
        field.onChange(val && props.getItemKey(val));
    }

    return <FormItem>
        {label && <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>}
        <FormControl>
            <div>
                <Combobox<TFieldModel>
                    ref={comboboxRef}
                    onSelect={onChange}
                    buttonClassName={cn(["w-full", buttonClassName])}
                    {...props}/>
            </div>
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage/>
    </FormItem>
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