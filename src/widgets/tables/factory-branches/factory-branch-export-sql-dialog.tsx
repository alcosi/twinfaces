"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { FactoryBranch_DETAILED } from "@/entities/factory-branch";
import { PrivateApiContext } from "@/shared/api";
import { ExportSqlDialog, ExportSqlDialogRef } from "@/shared/ui";

export type FactoryBranchExportSqlDialogRef = {
  open: (factoryBranchItem: FactoryBranch_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryBranchExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryBranchExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<FactoryBranch_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factoryBranchItem: FactoryBranch_DETAILED) => {
      itemRef.current = factoryBranchItem;
      dialogRef.current?.open({
        name: `Factory branch of factory: ${factoryBranchItem.factory.key}`,
      });
    },
  }));

  async function handleExport(): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No factory branch selected");

    const { data, error } = await api.factoryBranch.exportSql({
      body: {
        twinFactoryBranchIds: [item.id],
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
