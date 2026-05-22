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
import { SwitchFormField, TextFormField } from "@/components/form-fields";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { TwinStatus_DETAILED } from "@/entities/twin-status";
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

export const TWIN_CLASS_STATUSES_DUPLICATE_SCHEMA = z.object({
  originalTwinStatusId: z
    .string()
    .uuid("Original twin class status id is required"),
  newTwinClassId: z
    .string()
    .uuid("New twin class is required")
    .or(FIRST_ID_EXTRACTOR),
  newKey: z.string().trim().min(1, "Key is required"),
  duplicateTriggers: z.boolean(),
});

export type TwinClassStatusesDuplicateStatusesValues = z.infer<
  typeof TWIN_CLASS_STATUSES_DUPLICATE_SCHEMA
>;

export type TwinClassStatusesDuplicateDialogRef = {
  open: (status: TwinStatus_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const TwinClassStatusesDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<TwinClassStatusesDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFilters();
  const form = useForm<TwinClassStatusesDuplicateStatusesValues>({
    resolver: zodResolver(TWIN_CLASS_STATUSES_DUPLICATE_SCHEMA),
    defaultValues: {
      originalTwinStatusId: "",
      newTwinClassId: "",
      newKey: "",
      duplicateTriggers: true,
    },
  });

  const classInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "New class",
    adapter: twinClassAdapter,
    extraFilters: buildFilterFields(),
    mapExtraFilters: (filters) => mapFiltersToPayload(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
  };

  const [open, setOpen] = useState(false);
  const [selectedStatusName, setSelectedStatusName] = useState<
    string | undefined
  >(undefined);

  useImperativeHandle(ref, () => ({
    open: (field: TwinStatus_DETAILED) => {
      setSelectedStatusName(field.name || field.key);

      form.reset({
        originalTwinStatusId: field.id,
        newTwinClassId: field.twinClassId,
        newKey: "",
        duplicateTriggers: true,
      });

      setOpen(true);
    },
  }));

  function closeDialog() {
    (setOpen(false), setSelectedStatusName(undefined));
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

  async function handleOnSubmit(
    values: TwinClassStatusesDuplicateStatusesValues
  ) {
    try {
      const { error } = await api.twinStatus.duplicate({
        body: {
          duplicates: [values],
        },
      });

      if (error) {
        toast.error("Failed to duplicate status");
        throw error;
      }

      toast.success("Status duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate status error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Status</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedStatusName
              ? `Create a duplicate for "${selectedStatusName}".`
              : "Create a duplicate status"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...form.register("originalTwinStatusId")} />
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <ComplexComboboxFormField
                control={form.control}
                name="newTwinClassId"
                info={classInfo}
                required
              />
              <TextFormField
                control={form.control}
                name="newKey"
                label="New key"
              />
              <SwitchFormField
                control={form.control}
                name="duplicateTriggers"
                label="Duplicate triggers"
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
