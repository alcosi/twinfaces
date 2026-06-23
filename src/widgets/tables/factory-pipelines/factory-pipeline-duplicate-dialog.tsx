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

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { SwitchFormField } from "@/components/form-fields";

import { useFactorySelectAdapterWithFilters } from "@/entities/factory";
import { FactoryPipeline } from "@/entities/factory-pipeline";
import { PrivateApiContext } from "@/shared/api";
import { FIRST_ID_EXTRACTOR } from "@/shared/libs";
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
  originalFactoryPipelineId: z.string().uuid(),
  newTwinFactoryId: z.string().optional().or(FIRST_ID_EXTRACTOR),
  duplicateSteps: z.boolean(),
});

type FormValues = z.infer<typeof SCHEMA>;

export type FactoryPipelineDuplicateDialogRef = {
  open: (item: FactoryPipeline) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryPipelineDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryPipelineDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const factoryAdapter = useFactorySelectAdapterWithFilters();

  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      originalFactoryPipelineId: "",
      newTwinFactoryId: "",
      duplicateSteps: false,
    },
  });

  const factoryInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Copy to factory",
    adapter: factoryAdapter,
    extraFilters: {},
    searchPlaceholder: "Search...",
    selectPlaceholder: "Keep in same factory",
    multi: false,
  };

  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined
  );

  useImperativeHandle(ref, () => ({
    open: (item: FactoryPipeline) => {
      setSelectedName(item.description);
      form.reset({
        originalFactoryPipelineId: item.id!,
        newTwinFactoryId: "",
        duplicateSteps: false,
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
      const { error } = await api.factoryPipeline.duplicate({
        body: {
          duplicates: [
            {
              originalFactoryPipelineId: values.originalFactoryPipelineId,
              duplicateSteps: values.duplicateSteps,
              ...(values.newTwinFactoryId
                ? { newTwinFactoryId: values.newTwinFactoryId }
                : {}),
            },
          ],
        },
      });
      if (error) {
        toast.error("Failed to duplicate factory pipeline");
        throw error;
      }
      toast.success("Factory pipeline duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate factory pipeline error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Factory Pipeline</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedName
              ? `Create a duplicate for "${selectedName}".`
              : "Create a duplicate factory pipeline"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input
              type="hidden"
              {...form.register("originalFactoryPipelineId")}
            />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <ComplexComboboxFormField
                control={form.control}
                name="newTwinFactoryId"
                info={factoryInfo}
              />
              <SwitchFormField
                control={form.control}
                name="duplicateSteps"
                label="Duplicate steps"
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
