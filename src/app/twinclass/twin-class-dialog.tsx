import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/base/dialog";
import {Featurer, FeaturerParam, TwinClass, TwinClassCreateRq} from "@/lib/api/api-types";
import {Button} from "@/components/base/button";
import {z, ZodType} from "zod";
import {Control, useForm, FieldValues, FieldPath, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/base/input";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/base/form";
import {Textarea} from "@/components/base/textarea";
import {Checkbox} from "@/components/base/checkbox";
import {ReactNode, useContext, useEffect, useState} from "react";
import {Alert} from "@/components/base/alert";
import {ApiContext} from "@/lib/api/api";
import {Combobox, ComboboxProps} from "@/components/base/combobox";
import {cn} from "@/lib/utils";
import {
    CheckboxFormField,
    ComboboxFormField, FormFieldProps,
    TextAreaFormField,
    TextFormField
} from "@/components/form-fields";
import {FeaturerInput, FeaturerTypes, FeaturerValue} from "@/components/FeaturerInput";

interface ClassDialogProps {
    open: boolean,
    onOpenChange?: (open: boolean) => any,
    twinClass?: TwinClass,
    // On create or on edit success
    onSuccess?: () => any
}

export enum ClassDialogMode {
    Create,
    Edit
}

const classSchema = z.object({
    key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Key can only contain latin letters, numbers, underscores and dashes'),
    name: z.string().min(1).max(100),
    description: z.string().optional().or(z.literal('').transform(() => undefined)),
    abstractClass: z.boolean(),
    // headHunterFeaturerId: z.string().min(1, 'Head hunter featurer ID is required'),
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
})

export function TwinClassDialog({
                                    open,
                                    onOpenChange,
                                    twinClass,
                                    onSuccess
                                }: ClassDialogProps) {
    const [error, setError] = useState<string | null>(null)
    const [featurer, setFeaturer] = useState<FeaturerValue | null>(null)

    const mode = twinClass ? ClassDialogMode.Edit : ClassDialogMode.Create;

    const api = useContext(ApiContext)

    const form = useForm<z.infer<typeof classSchema>>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            key: "",
            name: "",
            description: "",
            abstractClass: false,
            // headHunterFeaturerId: "",
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

    const headTwinClassId = useWatch({
        control: form.control,
        name: 'headTwinClassId',
        defaultValue: ''
    })

    useEffect(() => {
        console.log('headTwinClassId changed', headTwinClassId)
        if (!headTwinClassId) {
            setFeaturer(null);
        }
    }, [headTwinClassId])

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

        if (data.headTwinClassId && !featurer) {
            setError("Please select a featurer");
            return;
        }

        const {name, description, ...withoutI18} = data;

        const requestBody: TwinClassCreateRq = {
            ...withoutI18,
            headHunterFeaturerId: featurer?.featurer.id,
            headHunterParams: featurer?.params,
            nameI18n: {
                translationInCurrentLocale: name,
                translations: {}
            },
            descriptionI18n: description ? {
                translationInCurrentLocale: description,
                translations: {}
            } : undefined,
        }

        const {data: response, error} = await api.twinClass.create({body: requestBody});

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

    async function findClassById(id: string) {
        const response = await api.twinClass.getById({id, query: {
                showTwinClassMode: 'DETAILED',
                showTwin2TwinClassMode: 'SHORT'
            }})
        return response.data?.twinClass;
    }


    return <Dialog open={open} onOpenChange={onOpenChangeInternal}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
            <DialogTrigger asChild>
                Open
            </DialogTrigger>
            <DialogHeader>
                <DialogTitle>
                    {mode === ClassDialogMode.Create && "Create new class"}
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
                                       getById={findClassById}
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

                    {headTwinClassId && <>
                        <FeaturerInput typeId={FeaturerTypes.headHunter} onChange={(val) => {
                            console.log('new featurer', val)
                            setFeaturer(val)
                        }}/>
                    </>}

                    <ComboboxFormField control={form.control} name="extendsTwinClassId" label="Extends"
                                       getById={findClassById}
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

                    <CheckboxFormField control={form.control} name="permissionSchemaSpace"
                                       label="Permission schema space"/>

                    <CheckboxFormField control={form.control} name="twinflowSchemaSpace" label="Twinflow schema space"/>

                    <CheckboxFormField control={form.control} name="twinClassSchemaSpace"
                                       label="Twin class schema space"/>

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
