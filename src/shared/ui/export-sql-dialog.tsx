"use client";

import { Check, Copy, Database, Download, FileCode2 } from "lucide-react";
import {
  ElementType,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "sonner";

import { cn } from "@/shared/libs";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Switch } from "@/shared/ui/switch";

/** A single include toggle shown in the export dialog. */
export type ExportSqlOption = {
  /** Key used in the flags object passed to {@link ExportSqlDialogProps.onExport}. */
  name: string;
  label: string;
  description?: string;
  icon?: ElementType;
  /** The toggle is only meaningful while this other option is enabled. */
  dependsOn?: string;
  /** Initial state when the dialog opens. Defaults to `true`. */
  defaultChecked?: boolean;
};

export type ExportSqlDialogRef = {
  open: (meta?: { name?: string }) => void;
  close: () => void;
};

export type ExportSqlDialogProps = {
  /** Dialog title. Defaults to "Export SQL". */
  title?: string;
  /** Include toggles. Omit (or pass `[]`) for an option-less export. */
  options?: ExportSqlOption[];
  /**
   * Runs the export with the chosen include flags and resolves to the SQL
   * text. Throw to signal failure — the dialog surfaces a toast.
   */
  onExport: (flags: Record<string, boolean>) => Promise<string>;
  onSuccess?: () => void;
};

function toFileName(name: string | undefined): string {
  const base = (name ?? "export").trim().replace(/[^\w.-]+/g, "_");
  return `${base || "export"}.sql`;
}

export const ExportSqlDialog = forwardRef(ExportSqlDialogComponent);

function ExportSqlDialogComponent(
  {
    title = "Export SQL",
    options = [],
    onExport,
    onSuccess,
  }: ExportSqlDialogProps,
  ref: ForwardedRef<ExportSqlDialogRef>
) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [exportedSql, setExportedSql] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function defaultFlags(): Record<string, boolean> {
    return Object.fromEntries(
      options.map((option) => [option.name, option.defaultChecked ?? true])
    );
  }

  function resetState() {
    setName(undefined);
    setFlags({});
    setExportedSql(undefined);
    setCopied(false);
  }

  useImperativeHandle(ref, () => ({
    open: (meta) => {
      resetState();
      setName(meta?.name);
      setFlags(defaultFlags());
      setOpen(true);
    },
    close: () => {
      resetState();
      setOpen(false);
    },
  }));

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && submitting) return;
    if (!nextOpen) {
      resetState();
      setOpen(false);
      return;
    }
    setOpen(true);
  }

  function isOptionDisabled(option: ExportSqlOption) {
    return option.dependsOn ? !flags[option.dependsOn] : false;
  }

  function setFlag(optionName: string, value: boolean) {
    setFlags((prev) => {
      const next = { ...prev, [optionName]: value };
      // Turning an option off also disables anything depending on it.
      if (!value) {
        for (const option of options) {
          if (option.dependsOn === optionName) next[option.name] = false;
        }
      }
      return next;
    });
  }

  const allSelected =
    options.length > 0 && options.every((option) => flags[option.name]);

  function toggleAll() {
    const next = !allSelected;
    setFlags(Object.fromEntries(options.map((option) => [option.name, next])));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const sql = await onExport(flags);
      setExportedSql(sql);
      setCopied(false);
      toast.success("Export sql successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Export sql error:", error);
      toast.error("Failed to export sql");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopySql() {
    if (!exportedSql) return;
    await navigator.clipboard.writeText(exportedSql);
    setCopied(true);
    toast.success("SQL copied");
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownloadSql() {
    if (!exportedSql) return;
    const blob = new Blob([exportedSql], { type: "text/sql;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = sqlFileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const sqlFileName = toFileName(name);
  const lineCount = exportedSql ? exportedSql.trimEnd().split("\n").length : 0;
  const hasOptions = options.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[min(540px,calc(100vw-32px))] max-w-none flex-col overflow-hidden">
        <DialogHeader className="h-auto py-4">
          <div className="flex items-center gap-3 pr-8">
            <span className="bg-brand-500/10 text-brand-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              <Database className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="truncate pt-0.5">
                {name ? (
                  <>
                    For{" "}
                    <span className="text-foreground font-medium">{name}</span>
                  </>
                ) : (
                  "Generate an SQL script."
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form className="flex min-h-0 min-w-0 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 max-w-full min-w-0 space-y-5 overflow-y-auto px-6 py-5">
            {hasOptions ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Include in export</p>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-brand-600 hover:text-brand-700 text-xs font-medium transition-colors"
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </button>
                </div>

                <Card className="divide-border divide-y overflow-hidden p-0 shadow-none">
                  {options.map((option) => {
                    const Icon = option.icon ?? FileCode2;
                    const disabled = isOptionDisabled(option);

                    return (
                      <div
                        key={option.name}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-3 transition-opacity",
                          disabled && "opacity-50"
                        )}
                      >
                        <span className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground text-sm font-medium">
                            {option.label}
                          </p>
                          {option.description && (
                            <p className="text-muted-foreground text-xs">
                              {option.description}
                            </p>
                          )}
                        </div>
                        <span className={cn(disabled && "pointer-events-none")}>
                          <Switch
                            aria-label={option.label}
                            checked={Boolean(flags[option.name]) && !disabled}
                            onCheckedChange={(checked) =>
                              setFlag(option.name, checked)
                            }
                          />
                        </span>
                      </div>
                    );
                  })}
                </Card>
              </div>
            ) : (
              !exportedSql && (
                <div className="border-border text-muted-foreground flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm">
                  <FileCode2 className="h-4 w-4 shrink-0" />
                  <span>An SQL script will be generated for this record.</span>
                </div>
              )
            )}

            {exportedSql && (
              <div className="max-w-full min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Generated SQL</span>
                    <Badge variant="secondary" className="font-normal">
                      {lineCount} {lineCount === 1 ? "line" : "lines"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSql}
                    >
                      <Download className="mr-1.5 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopySql}
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="ring-border bg-muted/50 w-full min-w-0 overflow-hidden rounded-lg ring-1">
                  <div className="bg-muted/70 border-border text-muted-foreground flex items-center justify-between border-b px-3 py-1.5">
                    <span className="flex min-w-0 items-center gap-1.5 text-xs">
                      <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{sqlFileName}</span>
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase">
                      SQL
                    </span>
                  </div>
                  <pre className="block max-h-[260px] w-full min-w-0 overflow-auto p-4 text-xs leading-5">
                    <code className="block w-max min-w-full whitespace-pre">
                      {exportedSql}
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="bg-background rounded-b-2xl p-4 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" loading={submitting}>
              <Database className="mr-2 h-4 w-4" />
              {exportedSql ? "Regenerate" : title}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
