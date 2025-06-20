"use client";

import { ReactNode, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";

type Props = {
  title: string;
  message?: ReactNode;
  confirmButtonText?: string;
  onConfirm?: () => void;
};

export function AlertDialog({
  title,
  message,
  confirmButtonText = "OK",
  onConfirm,
}: Partial<Props>) {
  const [open, setOpen] = useState(true);

  function handleConfirm() {
    onConfirm?.();
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogContent aria-describedby={title}>
        {title && (
          <DialogHeader>
            <DialogTitle showCloseButton={false}>{title}</DialogTitle>
          </DialogHeader>
        )}

        {message && typeof message === "string" ? (
          <DialogDescription className="p-6 text-balance">
            {message}
          </DialogDescription>
        ) : (
          message
        )}

        <DialogFooter className="p-4 sm:justify-end">
          <Button onClick={handleConfirm}>{confirmButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
