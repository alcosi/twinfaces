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
import {paths} from "@/lib/api/generated/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import createClient from "openapi-fetch";
import {useContext, useEffect, useState} from "react";
import {LoadingSpinner} from "@/components/ui/loading";
import {Alert} from "@/components/ui/alert";
import {ApiContext} from "@/lib/api/api";

interface ClassDialogProps {
    open: boolean,
    onOpenChange?: (open: boolean) => any,
    mode?: ClassDialogMode,
    twinClass?: TwinClass,
    // On create or on edit success
    onSuccess?: () => any
}

enum ClassDialogMode {
    Create,
    View,
    Edit
}

const classSchema = z.object({
    key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Key can only contain latin letters, numbers, underscores and dashes'),
    name: z.string().min(0).max(100),
    description: z.string(),
    abstractClass: z.boolean(),
});

export function ClassDialog({open, onOpenChange, mode = ClassDialogMode.Create, twinClass, onSuccess}: ClassDialogProps) {
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
        console.log('ClassDialog open', newOpen)
        if (!newOpen && form.formState.isSubmitting) {
            return;
        }
        onOpenChange?.(newOpen)
    }
    async function onSubmit(data: z.infer<typeof classSchema>) {
        console.log('submitting', data);
        setError(null);

        const {data: response, error} = await api.twinClass.create({body: data} );

        if (error) {
            console.error('failed to create class', error);
            setError("Failed to create class: " + error);
            return;
        }

        onOpenChange?.(false);
        onSuccess?.();
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
                    <FormField control={form.control} name="key"
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Key</FormLabel>
                                       <FormControl>
                                           <Input placeholder="Key" {...field} />
                                       </FormControl>
                                       {/*<FormDescription>*/}
                                       {/*    This is your public display name.*/}
                                       {/*</FormDescription>*/}
                                       <FormMessage/>
                                   </FormItem>
                               )}/>


                    <FormField control={form.control} name="name"
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Name</FormLabel>
                                       <FormControl>
                                           <Input placeholder="Name" {...field} />
                                       </FormControl>
                                       <FormMessage/>
                                   </FormItem>
                               )}/>

                    <FormField control={form.control} name="description"
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Description</FormLabel>
                                       <FormControl>
                                           <Textarea
                                               placeholder="What is this class for?"
                                               className="resize-none"
                                               {...field}
                                           />
                                       </FormControl>
                                       <FormMessage/>
                                   </FormItem>
                               )}/>

                    <FormField control={form.control} name="abstractClass"
                               render={({field}) => (
                                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                       <FormControl>
                                           <Checkbox
                                               checked={field.value}
                                               onCheckedChange={field.onChange}
                                           />
                                       </FormControl>
                                       <div className="space-y-1 leading-none">
                                           <FormLabel>
                                               Is abstract
                                           </FormLabel>
                                           {/*<FormDescription>*/}
                                           {/*    You can manage your mobile notifications in the{" "}*/}
                                           {/*    <Link href="/examples/forms">mobile settings</Link> page.*/}
                                           {/*</FormDescription>*/}
                                       </div>
                                   </FormItem>
                               )}/>


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