import { Alert } from "@/components/base/alert";
import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { ColorPickerFormField } from "@/components/form-fields/color-form-field";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import {
  TwinStatus,
  TwinStatusCreateRq,
  TwinStatusUpdateRq,
} from "@/entities/twinStatus";
import { ApiContext } from "@/shared/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateEditTwinStatusDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  twinClassId: string;
  status: TwinStatus | null;
  onSuccess?: () => any;
}

const twinStatusSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  name: z.string().min(0).max(100),
  description: z.string(),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  backgroundColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex color code")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  fontColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex color code")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export default function CreateEditTwinStatusDialog({
  open,
  onOpenChange,
  twinClassId,
  status,
  onSuccess,
}: CreateEditTwinStatusDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const api = useContext(ApiContext);

  function onOpenChangeInternal(newOpen: boolean) {
    console.log("CreateEditTwinStatusDialog onOpenChangeInternal", newOpen);
    if (!newOpen && form.formState.isSubmitting) {
      return;
    }

    onOpenChange?.(newOpen);
  }

  useEffect(() => {
    if (open) {
      if (status) {
        form.reset({
          key: status.key,
          name: status.name,
          description: status.description,
          logo: status.logo,
          backgroundColor: status.backgroundColor,
          fontColor: status.fontColor,
        });
      } else {
        form.reset();
      }
    }
  }, [open]);

  const form = useForm<z.infer<typeof twinStatusSchema>>({
    resolver: zodResolver(twinStatusSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      logo: "",
      backgroundColor: "#000000",
      fontColor: "#000000",
    },
  });

  async function onSubmit(formValues: z.infer<typeof twinStatusSchema>) {
    console.log("CreateEditTwinStatusDialog onSubmit", formValues);
    setError(null);

    const data: TwinStatusCreateRq | TwinStatusUpdateRq = {
      key: formValues.key,
      nameI18n: {
        translationInCurrentLocale: formValues.name,
        translations: {},
      },
      descriptionI18n: {
        translationInCurrentLocale: formValues.description,
        translations: {},
      },
      logo: formValues.logo,
      backgroundColor: formValues.backgroundColor,
      fontColor: formValues.fontColor,
    };

    if (!status) {
      const { data: response, error } = await api.twinStatus.create({
        twinClassId: twinClassId,
        data: data,
      });

      if (error) {
        console.error("failed to create class", error, typeof error);
        const errorMessage = error?.msg;
        setError("Failed to create class: " + (errorMessage ?? error));
        return;
      }
    } else {
      const { data: response, error } = await api.twinStatus.update({
        statusId: status.id!,
        data: data,
      });

      if (error) {
        console.error("failed to update class", error, typeof error);
        const errorMessage = error?.msg;
        setError("Failed to update class: " + (errorMessage ?? error));
        return;
      }
    }

    onOpenChange?.(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeInternal}>
      <DialogContent className="sm:max-w-md max-h-[100%] sm:max-h-[80%]">
        <DialogTrigger asChild>Open</DialogTrigger>
        <DialogHeader>
          <DialogTitle>{status ? "Edit status" : "Create status"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 overflow-y-auto max-h-[60vh] px-8 py-6">
              {status?.id && <Input value={status?.id} disabled />}

              <TextFormField
                control={form.control}
                name="key"
                label="Key"
                autoFocus={true}
              />

              <TextFormField control={form.control} name="name" label="Name" />

              <TextAreaFormField
                control={form.control}
                name="description"
                label="Description"
              />

              <TextFormField
                control={form.control}
                name="logo"
                label="Logo URL"
              />

              <ColorPickerFormField
                control={form.control}
                name="backgroundColor"
                label="Background color"
              />

              <ColorPickerFormField
                control={form.control}
                name="fontColor"
                label="Font color"
              />

              {error && <Alert variant="destructive">{error}</Alert>}
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
