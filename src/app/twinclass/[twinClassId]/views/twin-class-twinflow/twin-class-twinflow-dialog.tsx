import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { useClassStatuses } from "@/entities/twinClassStatus";
import { TwinFlowCreateRq } from "@/entities/twinFlow";
import { ApiContext } from "@/shared/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TwinStatusSelectField } from "@/features/twinStatus";

interface CreateEditTwinflowDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  twinClassId: string;
  onSuccess?: () => any;
}

const twinflowSchema = z.object({
  name: z.string().min(0).max(100),
  description: z.string(),
  initialStatusId: z.string(),
});

export default function CreateTwinflowDialog({
  open,
  onOpenChange,
  twinClassId,
  onSuccess,
}: CreateEditTwinflowDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const api = useContext(ApiContext);
  const { getStatusesBySearch, findStatusById } = useClassStatuses({
    twinClassId,
  });

  const form = useForm<z.infer<typeof twinflowSchema>>({
    resolver: zodResolver(twinflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onOpenChangeInternal(newOpen: boolean) {
    console.log("CreateEditTwinFieldDialog onOpenChangeInternal", newOpen);
    if (!newOpen && form.formState.isSubmitting) {
      return;
    }

    onOpenChange?.(newOpen);
  }

  async function onSubmit(formValues: z.infer<typeof twinflowSchema>) {
    console.log("CreateEditTwinflowDialog onSubmit", formValues);

    const { name, description, ...withoutI18 } = formValues;

    const requestBody: TwinFlowCreateRq = {
      nameI18n: {
        translationInCurrentLocale: name,
      },
      descriptionI18n: {
        translationInCurrentLocale: description,
      },
      ...withoutI18,
    };

    try {
      const { data: response, error } = await api.twinflow.create({
        twinClassId,
        body: requestBody,
      });

      if (error) {
        throw new Error("Failed to create twinflow");
      }
    } catch (e) {
      console.error("exception while creating twinflow", e);
      toast.error("Failed to create twinflow");
      return;
    }

    onOpenChange?.(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeInternal}>
      <DialogContent className="sm:max-w-md max-h-[100%] sm:max-h-[80%]">
        <DialogHeader>
          <DialogTitle>{"Create Twinflow"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 overflow-y-auto max-h-[60vh] px-8 py-6">
              <TextFormField
                control={form.control}
                name="name"
                label="Name"
                autoFocus={true}
              />

              <TextAreaFormField
                control={form.control}
                name="description"
                label="Description"
              />

              <TwinStatusSelectField
                twinClassId={twinClassId}
                control={form.control}
                name="initialStatusId"
                label="Initial status"
                required={true}
              />
            </div>

            <DialogFooter className="sm:justify-end bg-background p-6">
              <Button type="submit" loading={form.formState.isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
