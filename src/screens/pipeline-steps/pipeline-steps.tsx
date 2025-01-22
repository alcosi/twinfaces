"use client";

import { PipelineStep, usePipelineStepSearch } from "@/entities/pipeline-step";
import { ColumnDef } from "@tanstack/table-core";
import { PaginationState } from "@tanstack/react-table";
import { GuidWithCopy } from "@/shared/ui";
import { Factory, FactoryResourceLink } from "@/entities/factory";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { CrudDataTable } from "@/widgets/crud-data-table";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import { FactoryPipelineResourceLink } from "@/entities/factory-pipeline";

const colDefs: Record<
  keyof Omit<
    PipelineStep & { factoryConditionSetInvert: boolean; factory: Factory },
    "factoryConditionSetId" | "order" | "fillerParams" | "factoryPipelineId"
  >,
  ColumnDef<PipelineStep>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factoryPipeline?.factory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink
            data={original.factoryPipeline?.factory}
            withTooltip
          />
        </div>
      ),
  },
  factoryPipeline: {
    id: "factoryPipeline",
    accessorKey: "factoryPipeline",
    header: "Pipeline",
    cell: ({ row: { original } }) =>
      original.factoryPipeline && (
        <div className="max-w-48 inline-flex">
          <FactoryPipelineResourceLink
            data={original.factoryPipeline}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
    cell: (data) =>
      data.row.original.factoryPipeline?.factoryConditionSetInvert && <Check />,
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition Set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="max-w-48 inline-flex">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet}
            withTooltip
          />
        </div>
      ),
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  fillerFeaturerId: {
    id: "fillerFeaturerId",
    accessorKey: "fillerFeaturerId",
    header: "Filler featurer",
  },
  optional: {
    id: "optional",
    accessorKey: "optional",
    header: "Optional",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function PipelineStepsScreen() {
  const { searchPipelineStep } = usePipelineStepSearch();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Pipeline Steps", href: "/workspace/pipeline-steps" },
    ]);
  }, [setBreadcrumbs]);

  async function fetchPipelineStep(pagination: PaginationState, filters: {}) {
    try {
      return searchPipelineStep({ pagination });
    } catch (error) {
      toast.error("An error occured while fetching pipeline steps: " + error);
      throw new Error(
        "An error occured while fetching pipeline steps: " + error
      );
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryPipeline,
        colDefs.description,
        colDefs.factoryConditionSet,
        colDefs.active,
        colDefs.fillerFeaturerId,
        colDefs.optional,
        colDefs.factoryConditionSetInvert,
      ]}
      fetcher={fetchPipelineStep}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryPipeline,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.fillerFeaturerId,
        colDefs.active,
      ]}
    />
  );
}
