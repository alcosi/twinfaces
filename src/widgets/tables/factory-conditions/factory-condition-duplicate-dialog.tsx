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

import { FactoryCondition_DETAILED } from "@/entities/factory-condition";
import { useFactoryConditionSetSelectAdapterWithFilters } from "@/entities/factory-condition-set";
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
  originalFactoryConditionId: z.string().uuid(),
  newTwinFactoryConditionSetId: z.string().optional().or(FIRST_ID_EXTRACTOR),
});

type FormValues = z.infer<typeof SCHEMA>;

export type FactoryConditionDuplicateDialogRef = {
  open: (item: FactoryCondition_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryConditionDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryConditionDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const conditionSetAdapter = useFactoryConditionSetSelectAdapterWithFilters();

  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      originalFactoryConditionId: "",
      newTwinFactoryConditionSetId: "",
    },
  });

  const conditionSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Copy to condition set",
    adapter: conditionSetAdapter,
    extraFilters: {},
    searchPlaceholder: "Search...",
    selectPlaceholder: "Keep in same condition set",
    multi: false,
  };

  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined
  );

  useImperativeHandle(ref, () => ({
    open: (item: FactoryCondition_DETAILED) => {
      setSelectedName(item.description);
      form.reset({
        originalFactoryConditionId: item.id!,
        newTwinFactoryConditionSetId: "",
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
      const { error } = await api.factoryCondition.duplicate({
        body: {
          duplicates: [
            {
              originalFactoryConditionId: values.originalFactoryConditionId,
              ...(values.newTwinFactoryConditionSetId
                ? {
                    newTwinFactoryConditionSetId:
                      values.newTwinFactoryConditionSetId,
                  }
                : {}),
            },
          ],
        },
      });
      if (error) {
        toast.error("Failed to duplicate factory condition");
        throw error;
      }
      toast.success("Factory condition duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate factory condition error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Factory Condition</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedName
              ? `Create a duplicate for "${selectedName}".`
              : "Create a duplicate factory condition"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input
              type="hidden"
              {...form.register("originalFactoryConditionId")}
            />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <ComplexComboboxFormField
                control={form.control}
                name="newTwinFactoryConditionSetId"
                info={conditionSetInfo}
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
