import {TwinClassField, TwinClassFieldCreateRq} from "@/lib/api/api-types";
import {useContext, useEffect, useRef, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/base/dialog";
import {Form} from "@/components/base/form";
import {Input} from "@/components/base/input";
import {Alert} from "@/components/base/alert";
import {Button} from "@/components/base/button";
import {toast} from "sonner";
import {FeaturerInput, FeaturerTypes, FeaturerValue} from "@/components/FeaturerInput";
import {TextAreaFormField, TextFormField} from "@/components/form-fields/text-form-field";
import {CheckboxFormField} from "@/components/form-fields/checkbox-form-field";


interface CreateEditTwinFieldDialogProps {
    open: boolean,
    onOpenChange?: (open: boolean) => any,
    twinClassId: string,
    field: TwinClassField | null,
    onSuccess?: () => any
}

const twinFieldSchema = z.object({
    key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Key can only contain latin letters, numbers, underscores and dashes'),
    name: z.string().min(0).max(100),
    description: z.string(),
    required: z.boolean()
    // descriptor: z.object({
    //     fieldType: z.string()
    // })
})

export default function CreateEditTwinFieldDialog({
                                                      open,
                                                      onOpenChange,
                                                      twinClassId,
                                                      field,
                                                      onSuccess
                                                  }: CreateEditTwinFieldDialogProps) {

    const [featurer, setFeaturer] = useState<FeaturerValue | null>(null)
    const [error, setError] = useState<string | null>(null)

    const api = useContext(ApiContext)

    function onOpenChangeInternal(newOpen: boolean) {
        console.log('CreateEditTwinFieldDialog onOpenChangeInternal', newOpen)
        if (!newOpen && form.formState.isSubmitting) {
            return;
        }

        onOpenChange?.(newOpen)
    }

    useEffect(() => {
        console.log('CreateEditTwinFieldDialog useEffect open', open, field)
        if (!open) return;

        if (field) {
            form.reset({
                key: field.key,
                name: field.name,
                description: field.description,
                required: field.required
                // descriptor: field.descriptor
            }, {keepDefaultValues: true})
        } else {
            console.log('CreateEditTwinFieldDialog useEffect reset', form.formState.defaultValues)
            form.reset()
        }
        setError(null)
    }, [open])

    const form = useForm<z.infer<typeof twinFieldSchema>>({
        resolver: zodResolver(twinFieldSchema),
        defaultValues: {
            key: "",
            name: "",
            description: "",
            required: false
            // descriptor: {
            //     fieldType: ""
            // }
        }
    })

    async function onSubmit(formValues: z.infer<typeof twinFieldSchema>) {
        console.log('CreateEditTwinFieldDialog onSubmit', formValues)
        setError(null);

        if (!featurer) {
            setError("Featurer is required")
            return;
        }

        const {name, description, ...withoutI18} = formValues;

        const requestBody: TwinClassFieldCreateRq = {
            nameI18n: {
                translationInCurrentLocale: name
            },
            descriptionI18n: {
                translationInCurrentLocale: description
            },
            fieldTyperFeaturerId: featurer?.featurer.id,
            fieldTyperParams: featurer?.params,
            ...withoutI18
        }

        if (!field) {
            try {
                const {data: response, error} = await api.twinClass.createField({id: twinClassId, body: requestBody})
                if (error) {
                    console.error('failed to create field', error)
                    const errorMessage = error?.msg;
                    setError("Failed to create field: " + errorMessage ?? error)
                    return;
                }
            } catch (e) {
                console.error('exception while creating field', e)
                toast.error("Failed to create field")
                return;
            }
        } else {
            if (!field.id) {
                console.error('CRITICAL: Field ID is missing on update method!', field)
                setError("Something went wrong, please try again later.")
                return
            }

            try {
                const {data: response, error} = await api.twinClass.updateField({fieldId: field.id, body: requestBody})
                if (error) {
                    console.error('failed to update field', error)
                    const errorMessage = error?.msg;
                    setError("Failed to update field: " + errorMessage ?? error)
                    return;
                }
            } catch (e) {
                console.error('exception while updating field', e)
                toast.error("Failed to update field")
                return;
            }
        }

        onOpenChange?.(false);
        onSuccess?.();
    }

    return <Dialog open={open} onOpenChange={onOpenChangeInternal}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
            <DialogHeader>
                <DialogTitle>
                    {field ? "Edit field" : "Create field"}
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {field?.id && <Input value={field?.id} disabled/>}

                    <TextFormField control={form.control} name="key" label="Key"/>

                    <TextFormField control={form.control} name="name" label="Name"/>

                    <TextAreaFormField control={form.control} name="description" label="Description"/>

                    <CheckboxFormField control={form.control} name="required" label="Required"/>

                    <FeaturerInput typeId={FeaturerTypes.fieldTyper}
                                    defaultId={field?.fieldTyperFeaturerId}
                                    defaultParams={field?.fieldTyperParams}
                                   onChange={(val) => {
                                       console.log('new featurer', val)
                                       setFeaturer(val)
                                   }}/>

                    {/*<SelectFormField<z.infer<typeof twinFieldSchema>, FieldType>*/}
                    {/*    control={form.control} name="descriptor.fieldType"*/}
                    {/*    label="Type"*/}
                    {/*    values={fieldTypes}*/}
                    {/*    getItemLabel={(option) => option.label}*/}
                    {/*    getItemKey={(option) => option.fieldType}*/}
                    {/*/>*/}

                    {error && <Alert variant="destructive">
                        {error}
                    </Alert>}

                    {Object.values(form.formState.errors).length > 0 && <Alert variant="destructive">
                        There are errors in the form
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