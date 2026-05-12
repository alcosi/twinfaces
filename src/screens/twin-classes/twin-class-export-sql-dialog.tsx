import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { SwitchFormField } from "@/components/form-fields";

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

import { TwinClassDuplicateDialogRef } from "./twin-class-duplicate-dialog";

export const TWIN_CLASS_EXPORT_SQL_SCHEMA = z.object({
  twinClassIds: z.array(z.string().uuid()).min(1, "Twin class ID is required"),
  includeFields: z.boolean(),
  includeStatuses: z.boolean(),
  includeTwinflow: z.boolean(),
});

export type TwinClassExportSqlValues = z.infer<
  typeof TWIN_CLASS_EXPORT_SQL_SCHEMA
>;

export type TwinClassExportSqlDialogRef = {
  open: (twinClassItem: TwinClass_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const TwinClassExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<TwinClassDuplicateDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const [open, setOpen] = useState(false);
  const [selectedTwinClassName, setSelectedTwinClassName] = useState<
    string | undefined
  >(undefined);
  const form: UseFormReturn<TwinClassExportSqlValues> =
    useForm<TwinClassExportSqlValues>({
      resolver: zodResolver(TWIN_CLASS_EXPORT_SQL_SCHEMA),
      defaultValues: {
        twinClassIds: [],
        includeFields: true,
        includeStatuses: true,
        includeTwinflow: true,
      },
    });

  useImperativeHandle(ref, () => ({
    open: (twinClassItem: TwinClass_DETAILED) => {
      setSelectedTwinClassName(twinClassItem.name);
      form.reset({
        twinClassIds: [twinClassItem.id],
        includeFields: true,
        includeStatuses: true,
        includeTwinflow: true,
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

  async function handleOnSubmit(formValues: TwinClassExportSqlValues) {
    console.log("🚀 ~ handleOnSubmit ~ formValues:", formValues);
    try {
      const { error } = await api.twinClass.exportSql({
        body: formValues,
      });

      if (error) {
        toast.error("Failed to export sql");
        throw error;
      }

      toast.success("Export sql successfully!");
      closeDialog();
      onSuccess?.();
    } catch (error) {
      console.error("Export sql error:", error);
      throw error;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Export sql</DialogTitle>
          <DialogDescription className="pt-1">
            {selectedTwinClassName
              ? `Export sql for "${selectedTwinClassName}".`
              : "Create a export sql."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...form.register("twinClassIds")} />

            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              <SwitchFormField
                control={form.control}
                name="includeFields"
                label="Export fields"
              />
              <SwitchFormField
                control={form.control}
                name="includeStatuses"
                label="Export statuses"
              />
              <SwitchFormField
                control={form.control}
                name="includeTwinflow"
                label="Export twinflow"
              />
            </div>

            <DialogFooter className="bg-background rounded-b-md p-6 sm:justify-end">
              <Button type="submit" loading={form.formState.isSubmitting}>
                Export sql
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
