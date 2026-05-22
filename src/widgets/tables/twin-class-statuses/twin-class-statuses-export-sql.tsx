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

import { TwinStatus_DETAILED } from "@/entities/twin-status";
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

export const TWIN_CLASS_STATUS_EXPORT_SQL_SCHEMA = z.object({
  statusIds: z.array(z.string().uuid()).min(1, "Twin status ID is required"),
});

export type TwinClassStatusExportSqlValues = z.infer<
  typeof TWIN_CLASS_STATUS_EXPORT_SQL_SCHEMA
>;

export type TwinClassStatusExportSqlDialogRef = {
  open: (twinStatusItem: TwinStatus_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const TwinClassStatusesExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<TwinClassStatusExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const [open, setOpen] = useState(false);
  const [selectTwinStatusName, setSelectedTwinStatusName] = useState<
    string | undefined
  >(undefined);

  const form: UseFormReturn<TwinClassStatusExportSqlValues> =
    useForm<TwinClassStatusExportSqlValues>({
      resolver: zodResolver(TWIN_CLASS_STATUS_EXPORT_SQL_SCHEMA),
      defaultValues: {
        statusIds: [],
      },
    });

  useImperativeHandle(ref, () => ({
    open: (twinStatusItem: TwinStatus_DETAILED) => {
      setSelectedTwinStatusName(twinStatusItem.name);
      form.reset({
        statusIds: [twinStatusItem.id],
      });
      setOpen(true);
    },
  }));

  function closeDialog() {
    setOpen(false);
    setSelectedTwinStatusName(undefined);
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

  async function handleOnSubmit(formValues: TwinClassStatusExportSqlValues) {
    try {
      const { error } = await api.twinStatus.exportSql({
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
            {selectTwinStatusName
              ? `Export sql for "${selectTwinStatusName}".`
              : "Create a export sql."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...form.register("statusIds")} />

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
