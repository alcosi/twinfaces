"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { TwinStatus_DETAILED } from "@/entities/twin-status";
import { PrivateApiContext } from "@/shared/api";
import { ExportSqlDialog, ExportSqlDialogRef } from "@/shared/ui";

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
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<TwinStatus_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (twinStatusItem: TwinStatus_DETAILED) => {
      itemRef.current = twinStatusItem;
      dialogRef.current?.open({ name: twinStatusItem.name });
    },
  }));

  async function handleExport(): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No twin status selected");

    const { data, error } = await api.twinStatus.exportSql({
      body: {
        statusIds: [item.id],
      },
    });

    if (error || typeof data !== "string") {
      throw error ?? new Error("Export sql response is empty");
    }

    return data;
  }

  return (
    <ExportSqlDialog
      ref={dialogRef}
      title="Export SQL"
      onExport={handleExport}
      onSuccess={onSuccess}
    />
  );
}
