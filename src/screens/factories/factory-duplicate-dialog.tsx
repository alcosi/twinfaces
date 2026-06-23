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
import { toast } from "sonner";
import z from "zod";

import { SwitchFormField, TextFormField } from "@/components/form-fields";

import { Factory } from "@/entities/factory";
import { PrivateApiContext } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";
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

const SCHEMA = z.object({
  originalFactoryId: z.string().uuid(),
  newKey: z.string().trim().min(1, "Key is required"),
  duplicateBranches: z.boolean(),
  duplicateMultipliers: z.boolean(),
  duplicatePipelines: z.boolean(),
  duplicateErasers: z.boolean(),
  duplicateTriggers: z.boolean(),
  duplicateConditionSets: z.boolean(),
});

type FormValues = z.infer<typeof SCHEMA>;

export type FactoryDuplicateDialogRef = {
  open: (factory: Factory) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      originalFactoryId: "",
      newKey: "",
      duplicateBranches: false,
      duplicateMultipliers: false,
      duplicatePipelines: false,
      duplicateErasers: false,
      duplicateTriggers: false,
      duplicateConditionSets: false,
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined
  );

  useImperativeHandle(ref, () => ({
    open: (factory: Factory) => {
      setSelectedName(
        isPopulatedString(factory.name) ? factory.name : factory.key
      );
      form.reset({
        originalFactoryId: factory.id!,
        newKey: "",
        duplicateBranches: false,
        duplicateMultipliers: false,
        duplicatePipelines: false,
        duplicateErasers: false,
        duplicateTriggers: false,
        duplicateConditionSets: false,
      });
      setOpen(true);
    },
  }));

  function closeDialog() {
    setOpen(false);
    setSelectedName(undefined);
    form.reset();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && form.formState.isSubmitting) return;
    if (!nextOpen) {
      closeDialog();
      return;
    }
    setOpen(nextOpen);
  }

  async function handleOnSubmit(values: FormValues) {
    try {
      const { error } = await api.factory.duplicate({
        body: { duplicates: [values] },
      });
      if (error) {
        toast.error("Failed to duplicate factory");
        throw error;
      }
      toast.success("Factory duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate factory error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Factory</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedName
              ? `Create a duplicate for "${selectedName}".`
              : "Create a duplicate factory"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...form.register("originalFactoryId")} />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <TextFormField
                control={form.control}
                name="newKey"
                label="New key"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateBranches"
                label="Duplicate branches"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateMultipliers"
                label="Duplicate multipliers"
              />
              <SwitchFormField
                control={form.control}
                name="duplicatePipelines"
                label="Duplicate pipelines"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateErasers"
                label="Duplicate erasers"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateTriggers"
                label="Duplicate triggers"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateConditionSets"
                label="Duplicate condition sets"
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
