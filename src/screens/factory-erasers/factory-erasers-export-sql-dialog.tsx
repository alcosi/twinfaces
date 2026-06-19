"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { FactoryEraser_DETAILED } from "@/entities/factory-eraser";
import { PrivateApiContext } from "@/shared/api";
import { ExportSqlDialog, ExportSqlDialogRef } from "@/shared/ui";

export type FactoryEraserExportSqlDialogRef = {
  open: (factoryBranchItem: FactoryEraser_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryEraserExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryEraserExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<FactoryEraser_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factoryEraserItem: FactoryEraser_DETAILED) => {
      itemRef.current = factoryEraserItem;
      dialogRef.current?.open({
        name: `Factory eraser of factory: ${factoryEraserItem.factory.key}`,
      });
    },
  }));

  async function handleExport(): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No factory eraser selected");

    const { data, error } = await api.factoryEraser.exportSql({
      body: {
        twinFactoryEraserIds: [item.id],
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
