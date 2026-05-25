import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
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

  const [exportedSql, setExportedSql] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

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
    setExportedSql(undefined);
    setCopied(false);
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
    setExportedSql(undefined);
    setCopied(false);
  }

  async function handleOnSubmit(formValues: TwinClassStatusExportSqlValues) {
    try {
      const { data, error } = await api.twinStatus.exportSql({
        body: formValues,
      });

      if (error) {
        toast.error("Failed to export sql");
        throw error;
      }

      if (!data || typeof data !== "string") {
        toast.error("Export sql response is empty");
        return;
      }

      setExportedSql(data);
      setCopied(false);

      toast.success("Export sql successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Export sql error:", error);
      toast.error("Failed to export sql");

      throw error;
    }
  }

  async function handleCopySql() {
    if (!exportedSql) return;

    await navigator.clipboard.writeText(exportedSql);
    setCopied(true);
    toast.success("SQL copied");

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[80vh] w-[min(500px,calc(100vw-32px))] max-w-none flex-col overflow-hidden">
        <DialogHeader className="h-auto py-4">
          <DialogTitle>Export sql</DialogTitle>
          <DialogDescription className="pt-1">
            {selectTwinStatusName
              ? `Export sql for "${selectTwinStatusName}".`
              : "Create a export sql."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 min-w-0 flex-col"
            onSubmit={form.handleSubmit(handleOnSubmit)}
          >
            <input type="hidden" {...form.register("statusIds")} />

            <div className="min-h-0 max-w-full min-w-0 space-y-6 overflow-y-auto px-8 py-6">
              {exportedSql && (
                <div className="max-w-full min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">Generated SQL</span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopySql}
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-muted w-full min-w-0 overflow-hidden rounded-md border">
                    <pre className="block max-h-[260px] w-full min-w-0 overflow-auto p-4 text-xs leading-5">
                      <code className="block w-max min-w-full whitespace-pre">
                        {exportedSql}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
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
