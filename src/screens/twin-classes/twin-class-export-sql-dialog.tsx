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
  ref: ForwardedRef<TwinClassExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const [open, setOpen] = useState(false);
  const [selectedTwinClassName, setSelectedTwinClassName] = useState<
    string | undefined
  >(undefined);
  const [exportedSql, setExportedSql] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
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
    setExportedSql(undefined);
    setCopied(false);
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
    setExportedSql(undefined);
    setCopied(false);
  }

  async function handleOnSubmit(formValues: TwinClassExportSqlValues) {
    try {
      const { data, error } = await api.twinClass.exportSql({
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
            {selectedTwinClassName
              ? `Export sql for "${selectedTwinClassName}".`
              : "Create a export sql."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex min-h-0 min-w-0 flex-col"
            onSubmit={form.handleSubmit(handleOnSubmit)}
          >
            <input type="hidden" {...form.register("twinClassIds")} />

            <div className="min-h-0 max-w-full min-w-0 space-y-6 overflow-y-auto px-8 py-6">
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
