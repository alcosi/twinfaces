"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { PipelineStep_DETAILED } from "@/entities/factory-pipeline-step";
import { PrivateApiContext } from "@/shared/api";
import { ExportSqlDialog, ExportSqlDialogRef } from "@/shared/ui";

export type FactoryPipelineStepExportSqlDialogRef = {
  open: (factoryPipelineStepItem: PipelineStep_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryPipelineStepExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryPipelineStepExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<PipelineStep_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factoryPipelineStepItem: PipelineStep_DETAILED) => {
      itemRef.current = factoryPipelineStepItem;
      dialogRef.current?.open({
        name: `Factory pipeline step of factory: ${factoryPipelineStepItem.factoryPipeline?.factory?.key}`,
      });
    },
  }));

  async function handleExport(): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No factory pipeline step selected");

    const { data, error } = await api.pipelineStep.exportSql({
      body: {
        twinFactoryPipelineStepIds: [item.id],
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
