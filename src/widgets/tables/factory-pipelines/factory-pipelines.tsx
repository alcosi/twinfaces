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
  FactoryPipelineCountGroup,
  FactoryPipelineCountGroupField,
  FactoryPipelineFilterKeys,
  FactoryPipelineFilters,
  FactoryPipeline_DETAILED,
  useFactoryPipelineCount,
  useFactoryPipelineCreate,
  useFactoryPipelineFilters,
  useFactoryPipelineSearch,
} from "@/entities/factory-pipeline";
import { FACTORY_PIPELINE_SCHEMA } from "@/entities/factory-pipeline";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
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
  FactoryPipelineDuplicateDialog,
  FactoryPipelineDuplicateDialogRef,
} from "./factory-pipeline-duplicate-dialog";
import {
  FactoryPipelineExportSqlDialog,
  FactoryPipelineExportSqlDialogRef,
} from "./factory-pipeline-export-sql-dialog";
import { FactoryPipelineFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<
    FactoryPipeline_DETAILED,
    | "factoryId"
    | "factoryConditionSetId"
    | "nextFactoryId"
    | "outputTwinStatusId"
    | "inputTwinClass"
    // Wire-only payload: no resolved relation to render, so no column.
    | "afterCommitFactoryId"
    | "stepIdList"
  >,
  ColumnDef<FactoryPipeline_DETAILED>
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
    header: "Name",
  },

  factory: {
    id: "factory",
    accessorKey: "factory",
    header: () => <SortableHeader title="Factory" sortField="factoryName" />,
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },

  inputTwinClassId: {
    id: "inputTwinClassId",
    accessorKey: "inputTwinClassId",
    header: () => (
      <SortableHeader title="Input Class" sortField="inputTwinClassName" />
    ),
    cell: ({ row: { original } }) =>
      original.inputTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
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

  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: () => (
      <SortableHeader
        title="Condition Invert"
        sortField="factoryConditionSetInvert"
      />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  outputTwinStatus: {
    id: "outputTwinStatus",
    accessorKey: "outputTwinStatus",
    header: () => (
      <SortableHeader title="Output Status" sortField="outputTwinStatusName" />
    ),
    cell: ({ row: { original } }) =>
      original.outputTwinStatus && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink
            data={original.outputTwinStatus}
            twinClassId={original.inputTwinClassId!}
            withTooltip
          />
        </div>
      ),
  },

  nextFactory: {
    id: "nextFactory",
    accessorKey: "nextFactory",
    header: () => (
      <SortableHeader title="Next Factory" sortField="nextFactoryName" />
    ),
    cell: ({ row: { original } }) =>
      original.nextFactory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.nextFactory} withTooltip />
        </div>
      ),
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

  nextFactoryLimitScope: {
    id: "nextFactoryLimitScope",
    accessorKey: "nextFactoryLimitScope",
    header: () => (
      <SortableHeader
        title="Next Factory Limit Scope"
        sortField="nextFactoryLimitScope"
      />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  factoryPipelineStepsCount: {
    id: "factoryPipelineStepsCount",
    accessorKey: "factoryPipelineStepsCount",
    header: "Pipeline Steps",
  },
};

export function FactoryPipelinesTable({
  factoryId,
  outputTwinStatusId,
  title,
}: {
  factoryId?: string;
  outputTwinStatusId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { countFactoryPipelines } = useFactoryPipelineCount();
  const { createFactoryPipeline } = useFactoryPipelineCreate();
  const duplicateDialogRef = useRef<FactoryPipelineDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryPipelineExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryPipeline_DETAILED> = {
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
                duplicateDialogRef.current?.open(
                  original as FactoryPipeline_DETAILED
                );
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
                  original as FactoryPipeline_DETAILED
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

  // When the table is scoped to an entity, the filter for that entity is
  // dropped (it is fixed by the scope): a factory scope hides the factory
  // filter, an output-status scope hides the output-status filter.
  const enabledFilters: FactoryPipelineFilterKeys[] | undefined = isTruthy(
    factoryId
  )
    ? [
        "idList",
        "inputTwinClassIdList",
        "factoryConditionSetIdList",
        "active",
        "outputTwinStatusIdList",
        "nextFactoryIdList",
        "descriptionLikeList",
      ]
    : isTruthy(outputTwinStatusId)
      ? [
          "idList",
          "factoryIdList",
          "inputTwinClassIdList",
          "factoryConditionSetIdList",
          "active",
          "nextFactoryIdList",
          "descriptionLikeList",
        ]
      : undefined;

  const { buildFilterFields, mapFiltersToPayload } = useFactoryPipelineFilters({
    enabledFilters,
  });

  const factoryPipelinesForm = useForm<z.infer<typeof FACTORY_PIPELINE_SCHEMA>>(
    {
      resolver: zodResolver(FACTORY_PIPELINE_SCHEMA),
      defaultValues: {
        factoryId: factoryId || "",
        inputTwinClassId: "",
        factoryConditionSetId: "",
        factoryConditionSetInvert: false,
        active: true,
        outputStatusId: outputTwinStatusId || "",
        nextFactoryId: "",
        description: undefined,
      },
    }
  );

  // Maps the table filter values to the API payload and injects the
  // contextual factory / output-status constraints. Shared by the table
  // fetcher and the pie-chart count requests so both honour the active
  // filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<FactoryPipelineFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        factoryIdList: factoryId
          ? toArrayOfString(toArray(factoryId), "id")
          : mapped.factoryIdList,
        outputTwinStatusIdList: outputTwinStatusId
          ? toArrayOfString(toArray(outputTwinStatusId), "id")
          : mapped.outputTwinStatusIdList,
      };
    },
    [mapFiltersToPayload, factoryId, outputTwinStatusId]
  );

  async function fetchFactoryPipelines(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ) {
    try {
      return await searchFactoryPipelines({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<FactoryPipelineFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error(
        "An error occurred while fetching factory pipelines: " + error
      );
      throw new Error(
        "An error occurred while fetching factory pipelines: " + error
      );
    }
  }

  const showFactoryColumn = isFalsy(factoryId);
  const showOutputTwinStatusColumn = isFalsy(outputTwinStatusId);

  // Server-side breakdowns backed by /private/factory_pipeline/count/v1, bound
  // to the active filters: the pie charts, and the grouping of the table view,
  // whose groups open through the matching search filters.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<
        FactoryPipeline_DETAILED,
        FactoryPipelineCountGroup,
        FactoryPipelineFilters
      >({
        fields: [
          ...(showFactoryColumn
            ? [
                {
                  key: "factory",
                  label: "Factory",
                  groupField: "factoryId",
                  getValue: (g: FactoryPipelineCountGroup) => g.factoryId,
                  getText: (g: FactoryPipelineCountGroup) =>
                    g.factory?.name ?? g.factory?.key,
                  renderLabel: (g: FactoryPipelineCountGroup) =>
                    g.factory && (
                      <FactoryResourceLink data={g.factory} withTooltip />
                    ),
                  narrow:
                    narrowBy.idList<FactoryPipelineFilters>("factoryIdList"),
                },
              ]
            : []),
          {
            key: "inputTwinClass",
            label: "Input Class",
            groupField: "inputTwinClassId",
            getValue: (g) => g.inputTwinClassId,
            getText: (g) => g.inputTwinClass?.name ?? g.inputTwinClass?.key,
            renderLabel: (g) =>
              g.inputTwinClass && (
                <TwinClassResourceLink
                  data={g.inputTwinClass as TwinClass_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.idList<FactoryPipelineFilters>(
              "inputTwinClassIdList"
            ),
          },
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
            narrow: narrowBy.idList<FactoryPipelineFilters>(
              "factoryConditionSetIdList"
            ),
          },
          ...(showOutputTwinStatusColumn
            ? [
                {
                  key: "outputTwinStatus",
                  label: "Output Status",
                  groupField: "outputTwinStatusId",
                  getValue: (g: FactoryPipelineCountGroup) =>
                    g.outputTwinStatusId,
                  getText: (g: FactoryPipelineCountGroup) =>
                    g.outputTwinStatus?.name,
                  renderLabel: (g: FactoryPipelineCountGroup) =>
                    g.outputTwinStatus && (
                      <TwinClassStatusResourceLink
                        data={g.outputTwinStatus}
                        withTooltip
                      />
                    ),
                  narrow: narrowBy.idList<FactoryPipelineFilters>(
                    "outputTwinStatusIdList"
                  ),
                },
              ]
            : []),
          {
            key: "nextFactory",
            label: "Next Factory",
            groupField: "nextFactoryId",
            getValue: (g) => g.nextFactoryId,
            getText: (g) => g.nextFactory?.name ?? g.nextFactory?.key,
            renderLabel: (g) =>
              g.nextFactory && (
                <FactoryResourceLink data={g.nextFactory} withTooltip />
              ),
            narrow:
              narrowBy.idList<FactoryPipelineFilters>("nextFactoryIdList"),
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
            narrow: narrowBy.ternary<FactoryPipelineFilters>("active"),
          },
          {
            // The pipeline search has no condition-invert filter, so this
            // breakdown is offered by the pie charts only.
            key: "factoryConditionSetInvert",
            label: "Condition Invert",
            groupField: "factoryConditionSetInvert",
            getValue: (g) =>
              g.factoryConditionSetInvert === undefined
                ? undefined
                : String(g.factoryConditionSetInvert),
            getText: (g) =>
              g.factoryConditionSetInvert === undefined
                ? undefined
                : g.factoryConditionSetInvert
                  ? "Inverted"
                  : "Not inverted",
          },
          {
            key: "nextFactoryLimitScope",
            label: "Next Factory Limit Scope",
            groupField: "nextFactoryLimitScope",
            getValue: (g) =>
              g.nextFactoryLimitScope === undefined
                ? undefined
                : String(g.nextFactoryLimitScope),
            getText: (g) =>
              g.nextFactoryLimitScope === undefined
                ? undefined
                : g.nextFactoryLimitScope
                  ? "Scoped"
                  : "Not scoped",
            narrow: narrowBy.ternary<FactoryPipelineFilters>(
              "nextFactoryLimitScope"
            ),
          },
        ],
        resolveFilters: ({ filters }) =>
          resolveFilters(filters as Record<FactoryPipelineFilterKeys, unknown>),
        count: ({ filters, groupField, offset, limit }) =>
          countFactoryPipelines({
            filters,
            groupField: groupField as FactoryPipelineCountGroupField,
            offset,
            limit,
          }),
        fetchRows: ({ filters, pagination, sort }) =>
          searchFactoryPipelines({ pagination, filters, sort }),
      }),
    [
      resolveFilters,
      countFactoryPipelines,
      searchFactoryPipelines,
      showFactoryColumn,
      showOutputTwinStatusColumn,
    ]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_PIPELINE_SCHEMA>
  ) => {
    await createFactoryPipeline({ body: formValues });

    toast.success("Factory pipeline created successfully!");
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="pipelines"
        title={title}
        columns={[
          colDefs.id,
          ...(showFactoryColumn ? [colDefs.factory] : []),
          colDefs.inputTwinClassId,
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          ...(showOutputTwinStatusColumn ? [colDefs.outputTwinStatus] : []),
          colDefs.nextFactory,
          colDefs.description,
          actionsCol,
        ]}
        fetcher={fetchFactoryPipelines}
        getRowId={(row) => row.id!}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/pipelines/${row.id}`)
        }
        getRowHref={(row) => `/${PlatformArea.core}/pipelines/${row.id}`}
        defaultVisibleColumns={[
          colDefs.id,
          ...(showFactoryColumn ? [colDefs.factory] : []),
          colDefs.inputTwinClassId,
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          ...(showOutputTwinStatusColumn ? [colDefs.outputTwinStatus] : []),
          colDefs.nextFactory,
          colDefs.description,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={chartGroupings}
        grouping={grouping}
        dialogForm={factoryPipelinesForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <FactoryPipelineFormFields control={factoryPipelinesForm.control} />
        )}
      />

      <FactoryPipelineDuplicateDialog ref={duplicateDialogRef} />
      <FactoryPipelineExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
