"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SwitchFormField, TextFormField } from "@/components/form-fields";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { PrivateApiContext } from "@/shared/api";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
} from "@/shared/ui";

export const TWIN_CLASS_DUPLICATE_SCHEMA = z.object({
  originalTwinClassId: z.string().uuid("Original twin class id is required"),
  newKey: z.string().trim().min(1, "Key is required"),
  duplicateFields: z.boolean(),
  duplicateStatuses: z.boolean(),
});

export type TwinClassDuplicateFieldValues = z.infer<
  typeof TWIN_CLASS_DUPLICATE_SCHEMA
>;

export type TwinClassDuplicateDialogRef = {
  open: (twinClassItem: TwinClass_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const TwinClassDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<TwinClassDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const [open, setOpen] = useState(false);
  const [selectedTwinClassName, setSelectedTwinClassName] = useState<
    string | undefined
  >(undefined);
  const form: UseFormReturn<TwinClassDuplicateFieldValues> =
    useForm<TwinClassDuplicateFieldValues>({
      resolver: zodResolver(TWIN_CLASS_DUPLICATE_SCHEMA),
      defaultValues: {
        originalTwinClassId: "",
        newKey: "",
        duplicateFields: true,
        duplicateStatuses: true,
      },
    });

  useImperativeHandle(ref, () => ({
    open: (twinClassItem: TwinClass_DETAILED) => {
      setSelectedTwinClassName(twinClassItem.name);
      form.reset({
        originalTwinClassId: twinClassItem.id,
        newKey: "",
        duplicateFields: true,
        duplicateStatuses: true,
      });
      setOpen(true);
    },
  }));

  function closeDialog() {
    setOpen(false);
    setSelectedTwinClassName(undefined);
    form.reset();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && form.formState.isSubmitting) {
      return;
    }

    if (!nextOpen) {
      closeDialog();
      return;
    }

    setOpen(nextOpen);
  }

  async function handleOnSubmit(formValues: TwinClassDuplicateFieldValues) {
    try {
      const { error } = await api.twinClass.duplicate({
        body: {
          duplicates: [formValues],
        },
      });

      if (error) {
        toast.error("Failed to duplicate twin class");
        throw error;
      }

      toast.success("Twin class duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Twin Class</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedTwinClassName
              ? `Create a duplicate for "${selectedTwinClassName}".`
              : "Create a duplicate twin class."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...form.register("originalTwinClassId")} />

            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <TextFormField
                control={form.control}
                name="newKey"
                label="New key"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateFields"
                label="Duplicate fields"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateStatuses"
                label="Duplicate statuses"
              />
            </div>

            <DialogFooter className="bg-background rounded-b-md p-6 sm:justify-end">
              <Button type="submit" loading={form.formState.isSubmitting}>
                Duplicate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
