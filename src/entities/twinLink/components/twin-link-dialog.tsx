import { Alert } from "@/components/base/alert";
import { Button } from "@/components/base/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import { TextFormField } from "@/components/form-fields/text-form-field";
import { ApiContext } from "@/lib/api/api";
import { TwinClassLink, TwinLinkAddRqV1 } from "@/lib/api/api-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TwinLinkDialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    twinId: string;
    link?: TwinClassLink;
    onSuccess?: () => void;
}

const twinLinkSchema = z.object({
    linkId: z.string().uuid("Link ID must be a valid UUID"),
    dstTwinId: z.string().uuid("Destination Twin ID must be a valid UUID")
});

export const TwinLinkDialog = ({
    open,
    onOpenChange,
    twinId,
    link,
    onSuccess
}: TwinLinkDialogProps) => {
    const api = useContext(ApiContext);

    useEffect(() => {
        if (!open) return;

        if (link) {
            form.reset({
                linkId: link.id,
                dstTwinId: link.dstTwinClassId
            }, { keepDefaultValues: true });
        } else {
            form.reset();
        }
    }, [open]);

    function onOpenChangeInternal(newOpen: boolean) {
        if (!newOpen && form.formState.isSubmitting) {
            return;
        }

        onOpenChange?.(newOpen);
    }

    const form = useForm<z.infer<typeof twinLinkSchema>>({
        resolver: zodResolver(twinLinkSchema),
        defaultValues: {
            linkId: 'db68b1ba-4078-48c0-b80f-37ecb4b40053',
            dstTwinId: ""
        }
    });

    async function onSubmit(formValues: z.infer<typeof twinLinkSchema>) {
        const requestBody: TwinLinkAddRqV1 = {
            links: [
                {
                    linkId: formValues.linkId,
                    dstTwinId: formValues.dstTwinId
                }
            ]
        };

        try {
            if (!link) {
                const { data, error } = await api.twinLinks.create({ twinId, body: requestBody });
                if (error) {
                    toast.error(`Failed to create link: ${error.msg ?? error}`);
                    return;
                }
                toast.success("Link created successfully!");
            }

            onOpenChange?.(false);
            onSuccess?.();
        } catch (e) {
            console.error("Failed to submit link", e);
            toast.error("Failed to submit link");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeInternal}>
            <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
                <DialogHeader>
                    <DialogTitle>
                        {link ? "Edit Link" : "Create Link"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 p-1">
                            <TextFormField
                                control={form.control}
                                name="dstTwinId"
                                label="Destination Twin ID"
                            />
                        </div>

                        <div className="sticky bottom-0 bg-background">
                            <DialogFooter className="sm:justify-end py-4">
                                <Button type="submit" loading={form.formState.isSubmitting}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
