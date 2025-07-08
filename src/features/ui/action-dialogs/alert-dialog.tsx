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

type Props = {
  title: string;
  body?: ReactNode;
  confirmButtonText?: string;
  onConfirm?: () => void;
};

export function AlertDialog({
  title,
  body,
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

        {isPopulatedString(body) ? (
          <DialogDescription className="p-6 text-balance">
            {body}
          </DialogDescription>
        ) : (
          body
        )}

        <DialogFooter className="p-4 sm:justify-end">
          <Button onClick={handleConfirm}>{confirmButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
