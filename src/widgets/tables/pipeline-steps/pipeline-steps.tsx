"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PIPELINE_STEP_SCHEMA,
  PipelineStepFilterKeys,
  PipelineStep_DETAILED,
  usePipelineStepCreate,
  usePipelineStepFilters,
  usePipelineStepSearch,
} from "@/entities/factory-pipeline-step";
import { Featurer_DETAILED } from "@/entities/featurer";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryPipelineResourceLink } from "@/features/factory-pipeline/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  OneOf,
  isFalsy,
  isTruthy,
  isUndefined,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { PipelineStepFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    PipelineStep_DETAILED,
    | "id"
    | "description"
    | "factoryPipeline"
    | "factoryPipelineId"
    | "factoryConditionInvert"
    | "factoryConditionSet"
    | "active"
    | "fillerFeaturer"
    | "optional"
  >,
  ColumnDef<PipelineStep_DETAILED>
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
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },
  factoryPipelineId: {
    id: "factory",
    accessorKey: "factory",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factoryPipeline?.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink
            data={original.factoryPipeline.factory}
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
        <div className="inline-flex max-w-48">
          <FactoryPipelineResourceLink
            data={original.factoryPipeline}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
    cell: (data) => data.row.original.factoryConditionInvert && <Check />,
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition Set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="inline-flex max-w-48">
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
  fillerFeaturer: {
    id: "fillerFeaturer",
    accessorKey: "fillerFeaturer",
    header: "Filler featurer",
    cell: ({ row: { original } }) =>
      original.fillerFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fillerFeaturer as Featurer_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  optional: {
    id: "optional",
    accessorKey: "optional",
    header: "Optional",
    cell: (data) => data.getValue() && <Check />,
  },
};

type PipelineOnlyProps = {
  pipelineId?: string;
  factoryId?: never;
};

type FactoryOnlyProps = {
  factoryId?: string;
  pipelineId?: never;
};

type Props = {
  title?: string;
} & OneOf<[PipelineOnlyProps, FactoryOnlyProps]>;

export function PipelineStepsTable({ pipelineId, factoryId, title }: Props) {
  const router = useRouter();
  const { searchPipelineStep } = usePipelineStepSearch();
  const { createPipelineStep } = usePipelineStepCreate();
  const { buildFilterFields, mapFiltersToPayload } = usePipelineStepFilters({
    enabledFilters:
      isTruthy(pipelineId) || isTruthy(factoryId)
        ? ([
            "idList",
            isUndefined(factoryId) && "factoryIdList",
            isUndefined(pipelineId) && "factoryPipelineIdList",
            "descriptionLikeList",
            "optional",
            "conditionInvert",
            "active",
            "fillerFeaturerIdList",
            "factoryConditionSetIdList",
          ].filter(Boolean) as PipelineStepFilterKeys[])
        : undefined,
  });

  const pipelineStepForm = useForm<z.infer<typeof PIPELINE_STEP_SCHEMA>>({
    resolver: zodResolver(PIPELINE_STEP_SCHEMA),
    defaultValues: {
      factoryPipelineId: pipelineId || "",
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      active: true,
      optional: false,
      order: 0,
      description: undefined,
    },
  });

  async function fetchPipelineStep(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<PipelineStep_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchPipelineStep({
        pagination,
        filters: {
          ..._filters,
          factoryPipelineIdList: pipelineId
            ? toArrayOfString(toArray(pipelineId), "id")
            : _filters.factoryPipelineIdList,
          factoryIdList: factoryId
            ? toArrayOfString(toArray(factoryId), "id")
            : _filters.factoryIdList,
        },
      });
    } catch (error) {
      toast.error("An error occured while fetching pipeline steps: " + error);
      return { data: [], pagination: {} };
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PIPELINE_STEP_SCHEMA>
  ) => {
    const { factoryPipelineId, ...body } = formValues;

    await createPipelineStep({
      id: factoryPipelineId,
      body: { factoryPipelineStep: body },
    });
    toast.success("Pipeline step created successfully!");
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        ...(isFalsy(factoryId) ? [colDefs.factoryPipelineId] : []),
        ...(isFalsy(pipelineId) ? [colDefs.factoryPipeline] : []),
        colDefs.factoryConditionSet,
        colDefs.factoryConditionInvert,
        colDefs.active,
        colDefs.fillerFeaturer,
        colDefs.optional,
        colDefs.description,
      ]}
      fetcher={fetchPipelineStep}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/pipeline-steps/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(factoryId) ? [colDefs.factoryPipelineId] : []),
        ...(isFalsy(pipelineId) ? [colDefs.factoryPipeline] : []),
        colDefs.factoryConditionSet,
        colDefs.factoryConditionInvert,
        colDefs.fillerFeaturer,
        colDefs.active,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={pipelineStepForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <PipelineStepFormFields
          factoryId={factoryId}
          control={pipelineStepForm.control}
        />
      )}
      title={title}
    />
  );
}
