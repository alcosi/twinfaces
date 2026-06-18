"use client";

import { Asterisk, Eraser, Zap } from "lucide-react";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { Factory } from "@/entities/factory";
import { FactoryBranchIcon } from "@/features/factory-branch/ui";
import { FactoryPipelineStepIcon } from "@/features/factory-pipeline-step/ui";
import { FactoryPipelineIcon } from "@/features/factory-pipeline/ui";
import { PrivateApiContext } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";
import {
  ExportSqlDialog,
  ExportSqlDialogRef,
  ExportSqlOption,
} from "@/shared/ui";

// Mirrors the include flags accepted by /private/factory/export/sql/v1.
const FACTORY_EXPORT_OPTIONS: ExportSqlOption[] = [
  {
    name: "includeBranches",
    label: "Branches",
    description: "Branches with condition sets & conditions",
    icon: FactoryBranchIcon,
  },
  {
    name: "includeMultipliers",
    label: "Multipliers",
    description: "Multipliers with filters & conditions",
    icon: Asterisk,
  },
  {
    name: "includePipelines",
    label: "Pipelines",
    description: "Pipelines with condition sets & conditions",
    icon: FactoryPipelineIcon,
  },
  {
    name: "includePipelineSteps",
    label: "Pipeline steps",
    description: "Steps with conditions · needs pipelines",
    icon: FactoryPipelineStepIcon,
    dependsOn: "includePipelines",
  },
  {
    name: "includeErasers",
    label: "Erasers",
    description: "Erasers with condition sets & conditions",
    icon: Eraser,
  },
  {
    name: "includeTriggers",
    label: "Triggers",
    description: "Triggers with condition sets & conditions",
    icon: Zap,
  },
];

export type FactoryExportSqlDialogRef = {
  open: (factory: Factory) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const FactoryExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<FactoryExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const factoryRef = useRef<Factory | null>(null);

  useImperativeHandle(ref, () => ({
    open: (factory: Factory) => {
      factoryRef.current = factory;
      const name = isPopulatedString(factory.name) ? factory.name : factory.key;
      dialogRef.current?.open({ name });
    },
  }));

  async function handleExport(flags: Record<string, boolean>): Promise<string> {
    const factory = factoryRef.current;
    if (!factory?.id) throw new Error("No factory selected");

    const { data, error } = await api.factory.exportSql({
      body: {
        twinFactoryIds: [factory.id],
        includeBranches: flags.includeBranches,
        includeMultipliers: flags.includeMultipliers,
        includePipelines: flags.includePipelines,
        includePipelineSteps: flags.includePipelineSteps,
        includeErasers: flags.includeErasers,
        includeTriggers: flags.includeTriggers,
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
      options={FACTORY_EXPORT_OPTIONS}
      onExport={handleExport}
      onSuccess={onSuccess}
    />
  );
}
