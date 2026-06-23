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
import { FactoryConditionSet } from "@/entities/factory-condition-set";
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
  originalFactoryConditionSetId: z.string().uuid(),
  newTwinFactoryId: z.string().optional().or(FIRST_ID_EXTRACTOR),
  duplicateConditions: z.boolean(),
});

type FormValues = z.infer<typeof SCHEMA>;

export type FactoryConditionSetDuplicateDialogRef = {
  open: (item: FactoryConditionSet) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryConditionSetDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryConditionSetDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const factoryAdapter = useFactorySelectAdapterWithFilters();

  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      originalFactoryConditionSetId: "",
      newTwinFactoryId: "",
      duplicateConditions: false,
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
    open: (item: FactoryConditionSet) => {
      setSelectedName(item.description ?? item.name);
      form.reset({
        originalFactoryConditionSetId: item.id!,
        newTwinFactoryId: "",
        duplicateConditions: false,
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
      const { error } = await api.factoryConditionSet.duplicate({
        body: {
          duplicates: [
            {
              originalFactoryConditionSetId:
                values.originalFactoryConditionSetId,
              duplicateConditions: values.duplicateConditions,
              ...(values.newTwinFactoryId
                ? { newTwinFactoryId: values.newTwinFactoryId }
                : {}),
            },
          ],
        },
      });
      if (error) {
        toast.error("Failed to duplicate factory condition set");
        throw error;
      }
      toast.success("Factory condition set duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate factory condition set error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Condition Set</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedName
              ? `Create a duplicate for "${selectedName}".`
              : "Create a duplicate condition set"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input
              type="hidden"
              {...form.register("originalFactoryConditionSetId")}
            />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <ComplexComboboxFormField
                control={form.control}
                name="newTwinFactoryId"
                info={factoryInfo}
              />
              <SwitchFormField
                control={form.control}
                name="duplicateConditions"
                label="Duplicate conditions"
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
