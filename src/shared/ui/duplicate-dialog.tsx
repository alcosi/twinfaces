"use client";

import { Copy } from "lucide-react";
import {
  ElementType,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/forms/input";
import { Label } from "@/shared/ui/forms/label";

export type DuplicateDialogRef = {
  open: (meta: { id: string; name?: string }) => void;
  close: () => void;
};

export type DuplicateDialogProps = {
  title?: string;
  icon?: ElementType;
  /** Show a "New key" text input. Required for entities that need a key on duplication. */
  withNewKey?: boolean;
  onDuplicate: (params: { id: string; newKey?: string }) => Promise<void>;
  onSuccess?: () => void;
};

export const DuplicateDialog = forwardRef(DuplicateDialogComponent);

function DuplicateDialogComponent(
  {
    title = "Duplicate",
    icon: Icon = Copy,
    withNewKey = false,
    onDuplicate,
    onSuccess,
  }: DuplicateDialogProps,
  ref: ForwardedRef<DuplicateDialogRef>
) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [newKey, setNewKey] = useState("");
  const [newKeyError, setNewKeyError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const idRef = useRef<string>("");

  function resetState() {
    setName(undefined);
    setNewKey("");
    setNewKeyError(undefined);
  }

  useImperativeHandle(ref, () => ({
    open: (meta) => {
      resetState();
      idRef.current = meta.id;
      setName(meta.name);
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (withNewKey && !newKey.trim()) {
      setNewKeyError("Key is required");
      return;
    }

    setSubmitting(true);
    try {
      await onDuplicate({
        id: idRef.current,
        newKey: withNewKey ? newKey.trim() : undefined,
      });
      toast.success(`${title} completed successfully!`);
      resetState();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Duplicate error:", error);
      toast.error(`Failed to ${title.toLowerCase()}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex w-[min(480px,calc(100vw-32px))] max-w-none flex-col overflow-hidden">
        <DialogHeader className="h-auto py-4">
          <div className="flex items-center gap-3 pr-8">
            <span className="bg-brand-500/10 text-brand-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="truncate pt-0.5">
                {name ? (
                  <>
                    Create a duplicate for{" "}
                    <span className="text-foreground font-medium">{name}</span>
                  </>
                ) : (
                  "Create a duplicate of this record."
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {withNewKey && (
            <div className="space-y-1.5 px-6 py-4">
              <Label htmlFor="duplicate-new-key">New key</Label>
              <Input
                id="duplicate-new-key"
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value);
                  if (newKeyError) setNewKeyError(undefined);
                }}
                placeholder="Enter a unique key"
                autoFocus
              />
              {newKeyError && (
                <p className="text-destructive text-xs">{newKeyError}</p>
              )}
            </div>
          )}

          <DialogFooter className="bg-background rounded-b-2xl p-4 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={submitting}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
