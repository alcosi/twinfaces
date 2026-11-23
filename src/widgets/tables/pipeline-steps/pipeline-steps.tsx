"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PIPELINE_STEP_SCHEMA,
  PipelineStepCountGroup,
  PipelineStepCountGroupField,
  PipelineStepFilterKeys,
  PipelineStepFilters,
  PipelineStep_DETAILED,
  usePipelineStepCount,
  usePipelineStepCreate,
  usePipelineStepFilters,
  usePipelineStepSearch,
} from "@/entities/factory-pipeline-step";
import { Featurer_DETAILED } from "@/entities/featurer";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryPipelineResourceLink } from "@/features/factory-pipeline/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  OneOf,
  isFalsy,
  isTruthy,
  isUndefined,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import {
  BooleanIndicator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";

import {
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
} from "../../crud-data-table";
import {
  FactoryPipelineStepExportSqlDialog,
  FactoryPipelineStepExportSqlDialogRef,
} from "./factiry-pipeline-step-export-sql-dialog";
import {
  FactoryPipelineStepDuplicateDialog,
  FactoryPipelineStepDuplicateDialogRef,
} from "./factory-pipeline-step-duplicate-dialog";
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
    | "name"
  >,
  ColumnDef<PipelineStep_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
    cell: ({ row: { original } }) => original.name,
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: () => (
      <SortableHeader title="Description" sortField="description" />
    ),
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
    header: () => (
      <SortableHeader
        title="Condition invert"
        sortField="factoryConditionInvert"
      />
    ),
    cell: (data) => (
      <BooleanIndicator value={!!data.row.original.factoryConditionInvert} />
    ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: () => (
      <SortableHeader
        title="Condition Set"
        sortField="factoryConditionSetName"
      />
    ),
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
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },
  fillerFeaturer: {
    id: "fillerFeaturer",
    accessorKey: "fillerFeaturer",
    header: () => (
      <SortableHeader title="Filler featurer" sortField="fillerFeaturerName" />
    ),
    cell: ({ row: { original } }) =>
      original.fillerFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fillerFeaturer as Featurer_DETAILED}
            params={original.fillerDetailedParams}
            withTooltip
          />
        </div>
      ),
  },
  optional: {
    id: "optional",
    accessorKey: "optional",
    header: () => <SortableHeader title="Optional" sortField="optional" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
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
  const duplicateDialogRef =
    useRef<FactoryPipelineStepDuplicateDialogRef>(null);
  const exportSqlDialogRef =
    useRef<FactoryPipelineStepExportSqlDialogRef>(null);
  const { searchPipelineStep } = usePipelineStepSearch();
  const { countPipelineStep } = usePipelineStepCount();
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
      name: "",
      description: undefined,
    },
  });

  const actionsCol: ColumnDef<PipelineStep_DETAILED> = {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => (
      <div
        className="flex justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="iconS6"
              onClick={(event) => event.stopPropagation()}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                duplicateDialogRef.current?.open(original);
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(
                  original as PipelineStep_DETAILED
                );
              }}
              className="cursor-pointer"
            >
              <FolderUp className="mr-2 h-4 w-4" />
              Export sql
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  // Maps the table filter values to the API payload and injects the
  // contextual pipeline / factory constraints. Shared by the table fetcher and
  // the pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<PipelineStepFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        factoryPipelineIdList: pipelineId
          ? toArrayOfString(toArray(pipelineId), "id")
          : mapped.factoryPipelineIdList,
        factoryIdList: factoryId
          ? toArrayOfString(toArray(factoryId), "id")
          : mapped.factoryIdList,
      };
    },
    [mapFiltersToPayload, pipelineId, factoryId]
  );

  async function fetchPipelineStep(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<PipelineStep_DETAILED>> {
    try {
      return await searchPipelineStep({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<PipelineStepFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error("An error occured while fetching pipeline steps: " + error);
      return { data: [], pagination: {} };
    }
  }

  // Server-side breakdowns backed by /private/factory_pipeline_step/count/v1,
  // bound to the active filters: the pie charts, and the grouping of the table
  // view, whose groups open through the matching search filters.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<
        PipelineStep_DETAILED,
        PipelineStepCountGroup,
        PipelineStepFilters
      >({
        fields: [
          ...(isFalsy(pipelineId)
            ? [
                {
                  key: "factoryPipeline",
                  label: "Pipeline",
                  groupField: "factoryPipelineId",
                  getValue: (g: PipelineStepCountGroup) => g.factoryPipelineId,
                  getText: (g: PipelineStepCountGroup) =>
                    g.factoryPipeline?.description,
                  renderLabel: (g: PipelineStepCountGroup) =>
                    g.factoryPipeline && (
                      <FactoryPipelineResourceLink
                        data={g.factoryPipeline}
                        withTooltip
                      />
                    ),
                  narrow: narrowBy.idList<PipelineStepFilters>(
                    "factoryPipelineIdList"
                  ),
                },
              ]
            : []),
          {
            key: "factoryConditionSet",
            label: "Condition Set",
            groupField: "factoryConditionSetId",
            getValue: (g) => g.factoryConditionSetId,
            getText: (g) => g.factoryConditionSet?.name,
            renderLabel: (g) =>
              g.factoryConditionSet && (
                <FactoryConditionSetResourceLink
                  data={g.factoryConditionSet}
                  withTooltip
                />
              ),
            narrow: narrowBy.idList<PipelineStepFilters>(
              "factoryConditionSetIdList"
            ),
          },
          {
            key: "fillerFeaturer",
            label: "Filler featurer",
            groupField: "fillerFeaturerId",
            getValue: (g) =>
              g.fillerFeaturerId === undefined
                ? undefined
                : String(g.fillerFeaturerId),
            getText: (g) => g.fillerFeaturer?.name,
            renderLabel: (g) =>
              g.fillerFeaturer && (
                <FeaturerResourceLink
                  data={g.fillerFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.numberList<PipelineStepFilters>(
              "fillerFeaturerIdList"
            ),
          },
          {
            key: "active",
            label: "Active",
            groupField: "active",
            getValue: (g) =>
              g.active === undefined ? undefined : String(g.active),
            getText: (g) =>
              g.active === undefined
                ? undefined
                : g.active
                  ? "Active"
                  : "Inactive",
            narrow: narrowBy.ternary<PipelineStepFilters>("active"),
          },
          {
            key: "optional",
            label: "Optional",
            groupField: "optional",
            getValue: (g) =>
              g.optional === undefined ? undefined : String(g.optional),
            getText: (g) =>
              g.optional === undefined
                ? undefined
                : g.optional
                  ? "Optional"
                  : "Required",
            narrow: narrowBy.ternary<PipelineStepFilters>("optional"),
          },
          {
            key: "factoryConditionInvert",
            label: "Condition invert",
            groupField: "factoryConditionInvert",
            getValue: (g) =>
              g.factoryConditionInvert === undefined
                ? undefined
                : String(g.factoryConditionInvert),
            getText: (g) =>
              g.factoryConditionInvert === undefined
                ? undefined
                : g.factoryConditionInvert
                  ? "Inverted"
                  : "Not inverted",
            narrow: narrowBy.ternary<PipelineStepFilters>("conditionInvert"),
          },
        ],
        resolveFilters: ({ filters }) =>
          resolveFilters(filters as Record<PipelineStepFilterKeys, unknown>),
        count: ({ filters, groupField, offset, limit }) =>
          countPipelineStep({
            filters,
            groupField: groupField as PipelineStepCountGroupField,
            offset,
            limit,
          }),
        fetchRows: ({ filters, pagination, sort }) =>
          searchPipelineStep({ pagination, filters, sort }),
      }),
    [resolveFilters, countPipelineStep, searchPipelineStep, pipelineId]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PIPELINE_STEP_SCHEMA>
  ) => {
    await createPipelineStep({ body: formValues });
    toast.success("Pipeline step created successfully!");
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="pipeline-steps"
        columns={[
          colDefs.id,
          ...(isFalsy(factoryId) ? [colDefs.factoryPipelineId] : []),
          ...(isFalsy(pipelineId) ? [colDefs.factoryPipeline] : []),
          colDefs.factoryConditionSet,
          colDefs.factoryConditionInvert,
          colDefs.active,
          colDefs.fillerFeaturer,
          colDefs.optional,
          colDefs.name,
          colDefs.description,
          actionsCol,
        ]}
        fetcher={fetchPipelineStep}
        getRowId={(row) => row.id!}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/pipeline-steps/${row.id}`)
        }
        getRowHref={(row) => `/${PlatformArea.core}/pipeline-steps/${row.id}`}
        defaultVisibleColumns={[
          colDefs.id,
          ...(isFalsy(factoryId) ? [colDefs.factoryPipelineId] : []),
          ...(isFalsy(pipelineId) ? [colDefs.factoryPipeline] : []),
          colDefs.factoryConditionSet,
          colDefs.factoryConditionInvert,
          colDefs.fillerFeaturer,
          colDefs.active,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={chartGroupings}
        grouping={grouping}
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

      <FactoryPipelineStepDuplicateDialog ref={duplicateDialogRef} />
      <FactoryPipelineStepExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
