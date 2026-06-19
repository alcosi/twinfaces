"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import { PrivateApiContext } from "@/shared/api";
import { ExportSqlDialog, ExportSqlDialogRef } from "@/shared/ui";

export type FactoryMultiplierExportSqlDialogRef = {
  open: (factoryMultiplierItem: FactoryMultiplier_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryMultiplierExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryMultiplierExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<FactoryMultiplier_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factoryMultiplierItem: FactoryMultiplier_DETAILED) => {
      itemRef.current = factoryMultiplierItem;
      dialogRef.current?.open({
        name: `Factory multiplier of factory: ${factoryMultiplierItem.factory?.key}`,
      });
    },
  }));

  async function handleExport(): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No factory multiplier selected");

    const { data, error } = await api.factoryMultiplier.exportSql({
      body: {
        twinFactoryMultiplierIds: [item.id],
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
