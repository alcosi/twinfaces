import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {TwinClass} from "@/lib/api/api-types";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {Control, useForm, FieldValues, FieldPath} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {ReactNode, useContext, useEffect, useState} from "react";
import {Alert} from "@/components/ui/alert";
import {ApiContext} from "@/lib/api/api";
import {Combobox, ComboboxProps} from "@/components/ui/combobox";
import {cn} from "@/lib/utils";

interface ClassDialogProps {
    open: boolean,
    onOpenChange?: (open: boolean) => any,
    mode?: ClassDialogMode,
    twinClass?: TwinClass,
    // On create or on edit success
    onSuccess?: () => any
}

export enum ClassDialogMode {
    Create,
    View,
    Edit
}

const classSchema = z.object({
    key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Key can only contain latin letters, numbers, underscores and dashes'),
    name: z.string().min(0).max(100),
    description: z.string(),
    abstractClass: z.boolean(),
    headTwinClassId: z.string().optional(),
    extendsTwinClassId: z.string().optional()
});

export function ClassDialog({
                                open,
                                onOpenChange,
                                mode = ClassDialogMode.Create,
                                twinClass,
                                onSuccess
                            }: ClassDialogProps) {
    const [error, setError] = useState<string | null>(null)

    const api = useContext(ApiContext)

    const form = useForm<z.infer<typeof classSchema>>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            key: "",
            name: "",
            description: "",
            abstractClass: false
        }
    })


    function onOpenInternal() {
        form.reset();
    }

    useEffect(() => {
        if (open) {
            onOpenInternal();
        }
    }, [open])

    function onOpenChangeInternal(newOpen: boolean) {
        if (!newOpen && form.formState.isSubmitting) {
            return;
        }
        onOpenChange?.(newOpen)
    }

    async function onSubmit(data: z.infer<typeof classSchema>) {
        setError(null);

        const {data: response, error} = await api.twinClass.create({body: data});

        if (error) {
            console.error('failed to create class', error);
            setError("Failed to create class: " + error);
            return;
        }

        onOpenChange?.(false);
        onSuccess?.();
    }

    async function fetchClasses(search: string) {
        const {data, error} = await api.twinClass.search({pagination: {pageIndex: 0, pageSize: 10}, search});

        if (error) {
            console.error('failed to fetch classes', error)
            throw new Error("Failed to fetch classes")
        }

        return data.twinClassList ?? []
    }

    return <Dialog open={open} onOpenChange={onOpenChangeInternal}>
        <DialogContent className="sm:max-w-md">
            <DialogTrigger asChild>
                Open
            </DialogTrigger>
            <DialogHeader>
                <DialogTitle>
                    {mode === ClassDialogMode.Create && "Create new class"}
                    {mode === ClassDialogMode.View && "Class " + twinClass?.key}
                    {mode === ClassDialogMode.Edit && "Edit class " + twinClass?.key}
                </DialogTitle>
                <DialogDescription>

                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <MyTextFormField control={form.control} name="key" label="Key"/>

                    <MyTextFormField control={form.control} name="name" label="Name"/>

                    <MyTextAreaFormField control={form.control} name="description" label="Description"/>

                    <MyCheckboxFormField control={form.control} name="abstractClass" label="Is abstract"/>

                    <MyComboboxFormField control={form.control} name="headTwinClassId" label="Head"
                                         getItems={fetchClasses}
                                         getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
                                         getItemLabel={(c) => {
                                             let label = c?.key ?? "";
                                             if (c.name) label += ` (${c.name})`
                                             return label;
                                         }}
                    />

                    <MyComboboxFormField control={form.control} name="extendsTwinClassId" label="Extends"
                                         getItems={fetchClasses}
                                         getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
                                         getItemLabel={(c) => {
                                             let label = c?.key ?? "";
                                             if (c.name) label += ` (${c.name})`
                                             return label;
                                         }}
                    />

                    {error && <Alert variant="destructive">
                        {error}
                    </Alert>}

                    <DialogFooter className="sm:justify-end">
                        <Button type="submit" loading={form.formState.isSubmitting}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}

interface ViewOrEditTextProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label?: ReactNode;
    value?: string,
    onEdit?: () => any,
}

function ViewOrEditText<T extends FieldValues>({
                                                   name,
                                                   control,
                                                   label,
                                                   value,
                                                   onEdit
                                               }: ViewOrEditTextProps<T>) {
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return <MyTextFormField control={control} name={name} label={label}/>
    }

    return <FormItem onClick={() => setEditMode(true)}>
        {label && <FormLabel>{label}</FormLabel>}
        <div className="flex flex-row items-center space-x-2">
            <div>{value}</div>
        </div>
    </FormItem>
}

interface MyFormFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label?: ReactNode;
    placeholder?: string;
    description?: ReactNode;
}

function MyTextFormField<T extends FieldValues>({
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
                                  <Input placeholder={placeholder} {...field} autoFocus={true}/>
                              </FormControl>
                              {description && <FormDescription>{description}</FormDescription>}
                              <FormMessage/>
                          </FormItem>
                      )}/>
}

function MyTextAreaFormField<T extends FieldValues>({
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

function MyCheckboxFormField<T extends FieldValues>({
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

function MyComboboxFormField<T extends FieldValues, K>({
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