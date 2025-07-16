"use client";

import { ReactNode, useState } from "react";

import { isPopulatedString } from "@/shared/libs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";

type ConfirmDialogProps = {
  title: string;
  body: ReactNode;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
};

export function ConfirmDialog({
  title,
  body,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: Partial<ConfirmDialogProps>) {
  const [open, setOpen] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleCancel() {
    if (onCancel) {
      try {
        setCancelling(true);
        await onCancel();
      } finally {
        setCancelling(false);
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }

  async function handleConfirm() {
    if (onConfirm) {
      try {
        setConfirming(true);
        await onConfirm();
      } finally {
        setConfirming(false);
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent aria-describedby={title}>
        {title && (
          <DialogHeader>
            <DialogTitle showCloseButton={false}>{title}</DialogTitle>
          </DialogHeader>
        )}

        {isPopulatedString(body) ? (
          <DialogDescription className="p-6 text-balance">
            {body}
          </DialogDescription>
        ) : (
          body
        )}

        <DialogFooter className="p-4 sm:justify-end">
          <Button
            variant="secondary"
            onClick={handleCancel}
            loading={cancelling}
          >
            {cancelButtonText ?? "Cancel"}
          </Button>
          <Button onClick={handleConfirm} loading={confirming}>
            {confirmButtonText ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
