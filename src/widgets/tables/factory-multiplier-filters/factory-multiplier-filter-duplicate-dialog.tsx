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

import { useFactoryMultiplierSelectAdapterWithFilters } from "@/entities/factory-multiplier";
import { FactoryMultiplierFilter_DETAILED } from "@/entities/factory-multiplier-filter";
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
  originalFactoryMultiplierFilterId: z.string().uuid(),
  newTwinFactoryMultiplierId: z.string().optional().or(FIRST_ID_EXTRACTOR),
});

type FormValues = z.infer<typeof SCHEMA>;

export type FactoryMultiplierFilterDuplicateDialogRef = {
  open: (item: FactoryMultiplierFilter_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryMultiplierFilterDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryMultiplierFilterDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const multiplierAdapter = useFactoryMultiplierSelectAdapterWithFilters();

  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      originalFactoryMultiplierFilterId: "",
      newTwinFactoryMultiplierId: "",
    },
  });

  const multiplierInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Copy to multiplier",
    adapter: multiplierAdapter,
    extraFilters: {},
    searchPlaceholder: "Search...",
    selectPlaceholder: "Keep in same multiplier",
    multi: false,
  };

  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined
  );

  useImperativeHandle(ref, () => ({
    open: (item: FactoryMultiplierFilter_DETAILED) => {
      setSelectedName(item.description);
      form.reset({
        originalFactoryMultiplierFilterId: item.id!,
        newTwinFactoryMultiplierId: "",
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
      const { error } = await api.factoryMultiplierFilter.duplicate({
        body: {
          duplicates: [
            {
              originalFactoryMultiplierFilterId:
                values.originalFactoryMultiplierFilterId,
              ...(values.newTwinFactoryMultiplierId
                ? {
                    newTwinFactoryMultiplierId:
                      values.newTwinFactoryMultiplierId,
                  }
                : {}),
            },
          ],
        },
      });
      if (error) {
        toast.error("Failed to duplicate factory multiplier filter");
        throw error;
      }
      toast.success("Factory multiplier filter duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate factory multiplier filter error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Multiplier Filter</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedName
              ? `Create a duplicate for "${selectedName}".`
              : "Create a duplicate multiplier filter"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input
              type="hidden"
              {...form.register("originalFactoryMultiplierFilterId")}
            />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <ComplexComboboxFormField
                control={form.control}
                name="newTwinFactoryMultiplierId"
                info={multiplierInfo}
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
