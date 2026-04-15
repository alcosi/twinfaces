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
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { CheckboxFormField, TextFormField } from "@/components/form-fields";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { TwinClassFieldV1_DETAILED } from "@/entities/twin-class-field";
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

export const TWIN_CLASS_FIELD_DUPLICATE_SCHEMA = z.object({
  originalTwinClassFieldId: z
    .string()
    .uuid("Original twin class field id is required"),
  newTwinClassId: z
    .string()
    .uuid("New twin class is required")
    .or(FIRST_ID_EXTRACTOR),
  newKey: z.string().trim().min(1, "Key is required"),
  duplicateRules: z.boolean(),
});

export type TwinClassFieldDuplicateFieldValues = z.infer<
  typeof TWIN_CLASS_FIELD_DUPLICATE_SCHEMA
>;

export type TwinClassFieldDuplicateDialogRef = {
  open: (field: TwinClassFieldV1_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const TwinClassFieldDuplicateDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<TwinClassFieldDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFilters();
  const form = useForm<TwinClassFieldDuplicateFieldValues>({
    resolver: zodResolver(TWIN_CLASS_FIELD_DUPLICATE_SCHEMA),
    defaultValues: {
      originalTwinClassFieldId: "",
      newTwinClassId: "",
      newKey: "",
      duplicateRules: true,
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
  const [selectedFieldName, setSelectedFieldName] = useState<
    string | undefined
  >(undefined);

  useImperativeHandle(ref, () => ({
    open: (field: TwinClassFieldV1_DETAILED) => {
      setSelectedFieldName(field.name || field.key);
      form.reset({
        originalTwinClassFieldId: field.id,
        newTwinClassId: field.twinClassId,
        newKey: "",
        duplicateRules: true,
      });
      setOpen(true);
    },
  }));

  function closeDialog() {
    setOpen(false);
    setSelectedFieldName(undefined);
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

  async function handleOnSubmit(values: TwinClassFieldDuplicateFieldValues) {
    try {
      const { error } = await api.twinClassField.duplicate({
        body: {
          duplicates: [values],
        },
      });

      if (error) {
        toast.error("Failed to duplicate class field");
        throw error;
      }

      toast.success("Class field duplicated successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate class field error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Duplicate Class Field</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedFieldName
              ? `Create a duplicate for "${selectedFieldName}".`
              : "Create a duplicate class field."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input
              type="hidden"
              {...form.register("originalTwinClassFieldId")}
            />
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
              <CheckboxFormField
                control={form.control}
                name="duplicateRules"
                label="Duplicate rules"
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
