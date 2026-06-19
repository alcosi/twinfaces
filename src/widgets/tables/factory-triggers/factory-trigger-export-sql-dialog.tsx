"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { FactoryTrigger_DETAILED } from "@/entities/factory-trigger";
import { PrivateApiContext } from "@/shared/api";
import { ExportSqlDialog, ExportSqlDialogRef } from "@/shared/ui";

export type FactoryTriggerExportSqlDialogRef = {
  open: (factoryTriggerItem: FactoryTrigger_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryTriggerExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryTriggerExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<FactoryTrigger_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factoryTriggerItem: FactoryTrigger_DETAILED) => {
      itemRef.current = factoryTriggerItem;
      dialogRef.current?.open({
        name: `Factory trigger of factory: ${factoryTriggerItem.factory?.key}`,
      });
    },
  }));

  async function handleExport(): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No factory trigger selected");

    const { data, error } = await api.factoryTrigger.exportSql({
      body: {
        twinFactoryTriggerIds: [item.id],
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
