import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {TwinClass, TwinClassCreateRequestBody} from "@/lib/api/api-types";
import {Button} from "@/components/ui/button";
import {z, ZodType} from "zod";
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
import {
    CheckboxFormField,
    ComboboxFormField,
    TextAreaFormField,
    TextFormField
} from "@/components/ui/form-fields";

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
    headTwinClassId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
    extendsTwinClassId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
    logo: z.string().url().optional().or(z.literal('').transform(() => undefined)),
    permissionSchemaSpace: z.boolean(),
    twinflowSchemaSpace: z.boolean(),
    twinClassSchemaSpace: z.boolean(),
    aliasSpace: z.boolean(),
    markerDataListId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
    tagDataListId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
    viewPermissionId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
}) satisfies ZodType<TwinClassCreateRequestBody>;

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
            abstractClass: false,
            headTwinClassId: "",
            extendsTwinClassId: "",
            logo: "",
            permissionSchemaSpace: false,
            twinflowSchemaSpace: false,
            twinClassSchemaSpace: false,
            aliasSpace: false,
            markerDataListId: "",
            tagDataListId: "",
            viewPermissionId: "",
        }
    })


    function onOpenInternal() {
        form.reset();
        setError(null);
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
            console.error('failed to create class', error, typeof error);
            const errorMessage = error.msg;
            setError("Failed to create class: " + errorMessage ?? error);
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
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
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
                    <TextFormField control={form.control} name="key" label="Key"/>

                    <TextFormField control={form.control} name="name" label="Name"/>

                    <TextAreaFormField control={form.control} name="description" label="Description"/>

                    <CheckboxFormField control={form.control} name="abstractClass" label="Is abstract"/>

                    <TextFormField control={form.control} name="logo" label="Logo URL"/>

                    <ComboboxFormField control={form.control} name="headTwinClassId" label="Head"
                                       getItems={fetchClasses}
                                       getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
                                       getItemLabel={(c) => {
                                             let label = c?.key ?? "";
                                             if (c.name) label += ` (${c.name})`
                                             return label;
                                         }}
                                       selectPlaceholder={"Select head class"}
                                       searchPlaceholder={"Search head class..."}
                                       noItemsText={"No classes found"}
                    />

                    <ComboboxFormField control={form.control} name="extendsTwinClassId" label="Extends"
                                       getItems={fetchClasses}
                                       getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
                                       getItemLabel={(c) => {
                                             let label = c?.key ?? "";
                                             if (c.name) label += ` (${c.name})`
                                             return label;
                                         }}
                                       selectPlaceholder={"Select extends class"}
                                       searchPlaceholder={"Search extends class..."}
                                       noItemsText={"No classes found"}
                    />

                    <CheckboxFormField control={form.control} name="permissionSchemaSpace" label="Permission schema space"/>

                    <CheckboxFormField control={form.control} name="twinflowSchemaSpace" label="Twinflow schema space"/>

                    <CheckboxFormField control={form.control} name="twinClassSchemaSpace" label="Twin class schema space"/>

                    <CheckboxFormField control={form.control} name="aliasSpace" label="Alias space"/>

                    <TextFormField control={form.control} name="markerDataListId" label="Marker data list ID"/>

                    <TextFormField control={form.control} name="tagDataListId" label="Tag data list ID"/>

                    <TextFormField control={form.control} name="viewPermissionId" label="View permission ID"/>

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
        return <TextFormField control={control} name={name} label={label}/>
    }

    return <FormItem onClick={() => setEditMode(true)}>
        {label && <FormLabel>{label}</FormLabel>}
        <div className="flex flex-row items-center space-x-2">
            <div>{value}</div>
        </div>
    </FormItem>
}
