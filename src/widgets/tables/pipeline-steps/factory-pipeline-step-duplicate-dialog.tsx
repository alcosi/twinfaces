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

import { useFactoryPipelineSelectAdapterWithFilters } from "@/entities/factory-pipeline";
import { PipelineStep_DETAILED } from "@/entities/factory-pipeline-step";
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
  originalFactoryPipelineStepId: z.string().uuid(),
  newTwinFactoryPipelineId: z.string().optional().or(FIRST_ID_EXTRACTOR),
});

type FormValues = z.infer<typeof SCHEMA>;

export type FactoryPipelineStepDuplicateDialogRef = {
  open: (item: PipelineStep_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryPipelineStepDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryPipelineStepDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const pipelineAdapter = useFactoryPipelineSelectAdapterWithFilters();

  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      originalFactoryPipelineStepId: "",
      newTwinFactoryPipelineId: "",
    },
  });

  const pipelineInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Copy to pipeline",
    adapter: pipelineAdapter,
    extraFilters: {},
    searchPlaceholder: "Search...",
    selectPlaceholder: "Keep in same pipeline",
    multi: false,
  };

  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined
  );

  useImperativeHandle(ref, () => ({
    open: (item: PipelineStep_DETAILED) => {
      setSelectedName(item.description);
      form.reset({
        originalFactoryPipelineStepId: item.id!,
        newTwinFactoryPipelineId: "",
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
      const { error } = await api.pipelineStep.duplicate({
        body: {
          duplicates: [
            {
              originalFactoryPipelineStepId:
                values.originalFactoryPipelineStepId,
              ...(values.newTwinFactoryPipelineId
                ? { newTwinFactoryPipelineId: values.newTwinFactoryPipelineId }
                : {}),
            },
          ],
        },
      });
      if (error) {
        toast.error("Failed to duplicate factory pipeline step");
        throw error;
      }
      toast.success("Factory pipeline step duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate factory pipeline step error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Pipeline Step</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedName
              ? `Create a duplicate for "${selectedName}".`
              : "Create a duplicate pipeline step"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input
              type="hidden"
              {...form.register("originalFactoryPipelineStepId")}
            />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <ComplexComboboxFormField
                control={form.control}
                name="newTwinFactoryPipelineId"
                info={pipelineInfo}
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
