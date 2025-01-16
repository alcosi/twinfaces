"use client";

import {
  PipelineSteps,
  usePipelineStepsSearch,
} from "@/entities/pipelineSteps";
import { ColumnDef } from "@tanstack/table-core";
import { PaginationState } from "@tanstack/react-table";
import { GuidWithCopy } from "@/shared/ui";
import { FactoryResourceLink } from "../../entities/factory/components/resource-link/resource-link";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { CrudDataTable } from "@/widgets/crud-data-table";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";

const colDefs: Record<
  keyof Omit<
    PipelineSteps,
    "factoryConditionSetId" | "order" | "fillerParams" | "factoryPipeline"
  >,
  ColumnDef<PipelineSteps>
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
  //TODO: Replace with a Factory field
  factoryPipelineId: {
    id: "factoryPipelineId",
    accessorKey: "factoryPipelineId",
    header: "FactoryPipelineId",
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition Set",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        {original.factoryConditionSet && (
          <FactoryResourceLink
            data={original.factoryConditionSet}
            withTooltip
          />
        )}
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
    header: "FillerFeaturerId",
  },
  optional: {
    id: "optional",
    accessorKey: "optional",
    header: "Optional",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function PipelineStepsScreen() {
  const { searchPipelineSteps } = usePipelineStepsSearch();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Pipeline Steps", href: "/workspace/pipeline-steps" },
    ]);
  }, [setBreadcrumbs]);

  async function fetchPipelineSteps(pagination: PaginationState, filters: {}) {
    try {
      return searchPipelineSteps({ pagination });
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
        colDefs.description,
        colDefs.factoryPipelineId,
        colDefs.factoryConditionSet,
        colDefs.active,
        colDefs.fillerFeaturerId,
        colDefs.optional,
      ]}
      fetcher={fetchPipelineSteps}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factoryPipelineId,
        colDefs.factoryConditionSet,
        colDefs.fillerFeaturerId,
        colDefs.active,
      ]}
    />
  );
}
