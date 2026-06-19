"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { FactoryPipeline } from "@/entities/factory-pipeline";
import { FactoryPipelineIcon } from "@/features/factory-pipeline/ui";
import { PrivateApiContext } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";
import {
  ExportSqlDialog,
  ExportSqlDialogRef,
  ExportSqlOption,
} from "@/shared/ui";

const FACTORY_PIPELINE_EXPORT_OPTIONS: ExportSqlOption[] = [
  {
    name: "includePipelineSteps",
    label: "Steps",
    description: "Pipeline steps with condition sets & conditions",
    icon: FactoryPipelineIcon,
  },
];

export type FactoryPipelineExportSqlDialogRef = {
  open: (factory: FactoryPipeline) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryPipelineExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryPipelineExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const factoryPipelineRef = useRef<FactoryPipeline | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factoryPipeline: FactoryPipeline) => {
      factoryPipelineRef.current = factoryPipeline;
      const name = isPopulatedString(factoryPipeline.factory)
        ? `Factory pipeline of factory: ${factoryPipeline.factory.name}`
        : `Factory pipeline of factory: ${factoryPipeline?.factory?.key}`;
      dialogRef.current?.open({ name });
    },
  }));

  async function handleExport(flags: Record<string, boolean>): Promise<string> {
    const factoryPipeline = factoryPipelineRef.current;
    if (!factoryPipeline?.id) throw new Error("No factory pipeline selected");

    const { data, error } = await api.factoryPipeline.exportSql({
      body: {
        twinFactoryPipelineIds: [factoryPipeline.id],
        includePipelineSteps: flags.includePipelineSteps,
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
      options={FACTORY_PIPELINE_EXPORT_OPTIONS}
      onExport={handleExport}
      onSuccess={onSuccess}
    />
  );
}
