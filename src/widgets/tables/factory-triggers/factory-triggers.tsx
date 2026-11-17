import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FACTORY_TRIGGER_SCHEMA,
  FactoryTriggerCountGroup,
  FactoryTriggerCountGroupField,
  FactoryTriggerFilterKeys,
  FactoryTriggerFilters,
  FactoryTrigger_DETAILED,
  useFactoryTriggerCount,
  useFactoryTriggerCreate,
  useFactoryTriggerFilters,
  useFactoryTriggerSearch,
} from "@/entities/factory-trigger";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, toArray, toArrayOfString } from "@/shared/libs";
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
  CountGroupField,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
} from "../../crud-data-table";
import {
  FactoryTriggerDuplicateDialog,
  FactoryTriggerDuplicateDialogRef,
} from "./factory-trigger-duplicate-dialog";
import {
  FactoryTriggerExportSqlDialog,
  FactoryTriggerExportSqlDialogRef,
} from "./factory-trigger-export-sql-dialog";
import { TriggersFormFields } from "./form-fields";

type TriggersFormValues = z.infer<typeof FACTORY_TRIGGER_SCHEMA>;

const colDefs: Record<
  | "id"
  | "factory"
  | "inputTwinClass"
  | "factoryConditionSet"
  | "twinFactoryConditionInvert"
  | "active"
  | "description"
  | "twinTrigger"
  | "async",
  ColumnDef<FactoryTrigger_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: () => (
      <SortableHeader title="Twin factory" sortField="twinFactoryName" />
    ),
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  inputTwinClass: {
    id: "inputTwinClass",
    accessorKey: "inputTwinClass",
    header: () => (
      <SortableHeader title="Input twin class" sortField="inputTwinClassName" />
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
        title="Twin factory condition set"
        sortField="twinFactoryConditionSetName"
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
  twinFactoryConditionInvert: {
    id: "twinFactoryConditionInvert",
    accessorKey: "twinFactoryConditionInvert",
    header: () => (
      <SortableHeader
        title="Twin factory condition invert"
        sortField="twinFactoryConditionInvert"
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
  twinTrigger: {
    id: "twinTrigger",
    accessorKey: "twinTrigger",
    header: () => (
      <SortableHeader title="Twin trigger" sortField="twinTriggerName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinTrigger && (
        <div className="inline-flex max-w-48">
          <TwinTriggerResourceLink data={original.twinTrigger} withTooltip />
        </div>
      ),
  },
  async: {
    id: "async",
    accessorKey: "async",
    header: () => <SortableHeader title="Async" sortField="async" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },
};

export function FactoryTriggersTable({
  twinTriggerId,
}: {
  twinTriggerId?: string;
}) {
  const router = useRouter();
  const { searchFactoryTrigger } = useFactoryTriggerSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryTriggerFilters({
    enabledFilters: isTruthy(twinTriggerId)
      ? [
          "idList",
          "twinFactoryIdList",
          "inputTwinClassIdList",
          "idList",
          "active",
          "async",
        ]
      : undefined,
  });
  const { countFactoryTriggers } = useFactoryTriggerCount();
  const { createFactoryTrigger } = useFactoryTriggerCreate();
  const duplicateDialogRef = useRef<FactoryTriggerDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryTriggerExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryTrigger_DETAILED> = {
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
                  original as FactoryTrigger_DETAILED
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
                  original as FactoryTrigger_DETAILED
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

  // Maps the table filter values to the API payload and pins the contextual
  // twin trigger. Shared by the fetcher and the pie-chart count requests so
  // both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<FactoryTriggerFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);

      return {
        ...mapped,
        twinTriggerIdList: twinTriggerId
          ? toArrayOfString(toArray(twinTriggerId), "id")
          : mapped.twinTriggerIdList,
      };
    },
    [mapFiltersToPayload, twinTriggerId]
  );

  async function fetchFactoryTriggers(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<FactoryTrigger_DETAILED>> {
    try {
      return await searchFactoryTrigger({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<FactoryTriggerFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error("An error occured while fetching factory triggers:" + error);
      throw new Error(
        "An error occured while fetching factory triggers: " + error
      );
    }
  }

  // Server-side breakdowns backed by /private/twin_factory/trigger/count/v1,
  // bound to the active filters: the pie charts, and the grouping of the table
  // view, whose groups open through the matching search filters.
  const { chartGroupings, grouping } = useMemo(() => {
    type Field = CountGroupField<
      FactoryTriggerCountGroup,
      FactoryTriggerFilters
    >;

    /** A boolean grouping, whose label is just the flag's meaning. */
    const flagField = (
      key: FactoryTriggerCountGroupField,
      label: string,
      read: (group: FactoryTriggerCountGroup) => boolean | undefined,
      [onLabel, offLabel]: [string, string],
      narrow?: Field["narrow"]
    ): Field => ({
      key,
      label,
      groupField: key,
      getValue: (g) => (read(g) === undefined ? undefined : String(read(g))),
      getText: (g) =>
        read(g) === undefined ? undefined : read(g) ? onLabel : offLabel,
      narrow,
    });

    const fields: Field[] = [
      {
        key: "twinFactoryId",
        label: "Twin factory",
        groupField: "twinFactoryId",
        getValue: (g) => g.twinFactoryId,
        getText: (g) => g.factory?.name,
        renderLabel: (g) =>
          g.factory && <FactoryResourceLink data={g.factory} withTooltip />,
        narrow: narrowBy.idList<FactoryTriggerFilters>("twinFactoryIdList"),
      },
      {
        key: "inputTwinClassId",
        label: "Input twin class",
        groupField: "inputTwinClassId",
        getValue: (g) => g.inputTwinClassId,
        getText: (g) => g.inputTwinClass?.name,
        renderLabel: (g) =>
          g.inputTwinClass && (
            <TwinClassResourceLink data={g.inputTwinClass} withTooltip />
          ),
        narrow: narrowBy.idList<FactoryTriggerFilters>("inputTwinClassIdList"),
      },
      flagField(
        "active",
        "Active",
        (g) => g.active,
        ["Active", "Inactive"],
        narrowBy.ternary<FactoryTriggerFilters>("active")
      ),
      flagField(
        "async",
        "Async",
        (g) => g.async,
        ["Async", "Sync"],
        narrowBy.ternary<FactoryTriggerFilters>("async")
      ),
      // The trigger search has no condition-invert filter, so this breakdown
      // is offered by the pie charts only.
      flagField(
        "twinFactoryConditionInvert",
        "Condition invert",
        (g) => g.twinFactoryConditionInvert,
        ["Inverted", "Not inverted"]
      ),
    ];

    // Scoped to one twin trigger, that column is a constant and carries no
    // information — same reason it is dropped from the filters.
    if (!isTruthy(twinTriggerId)) {
      fields.push({
        key: "twinTriggerId",
        label: "Twin trigger",
        groupField: "twinTriggerId",
        getValue: (g) => g.twinTriggerId,
        getText: (g) => g.twinTrigger?.name,
        renderLabel: (g) =>
          g.twinTrigger && (
            <TwinTriggerResourceLink data={g.twinTrigger} withTooltip />
          ),
        narrow: narrowBy.idList<FactoryTriggerFilters>("twinTriggerIdList"),
      });
    }

    return buildCountGroupings<
      FactoryTrigger_DETAILED,
      FactoryTriggerCountGroup,
      FactoryTriggerFilters
    >({
      fields,
      resolveFilters: ({ filters }) =>
        resolveFilters(filters as Record<FactoryTriggerFilterKeys, unknown>),
      count: ({ filters, groupField, offset, limit }) =>
        countFactoryTriggers({
          filters,
          groupField: groupField as FactoryTriggerCountGroupField,
          offset,
          limit,
        }),
      fetchRows: ({ filters, pagination, sort }) =>
        searchFactoryTrigger({ pagination, filters, sort }),
    });
  }, [
    resolveFilters,
    countFactoryTriggers,
    searchFactoryTrigger,
    twinTriggerId,
  ]);

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(FACTORY_TRIGGER_SCHEMA),
    defaultValues: {
      twinTriggerId: twinTriggerId || "",
      twinFactoryConditionInvert: false,
      active: false,
      async: false,
    },
  });

  const handleOnCreateSubmit = async (formValues: TriggersFormValues) => {
    console.log("🚀 ~ handleOnCreateSubmit ~ formValues:", formValues);
    try {
      await createFactoryTrigger({
        body: {
          twinFactoryTriggers: [
            {
              twinFactoryId: formValues.twinFactoryId,
              inputTwinClassId: formValues.inputTwinClassId,
              twinFactoryConditionSetId: formValues.twinFactoryConditionSetId,
              twinFactoryConditionInvert: formValues.twinFactoryConditionInvert,
              active: formValues.active,
              description: formValues.description,
              twinTriggerId: formValues.twinTriggerId,
              async: formValues.async,
            },
          ],
        },
      });

      toast.success("Factory trigger created successfully");
    } catch {
      toast.error("Failed to create factory trigger");
    }
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="factory-triggers"
        title="Factory triggers"
        columns={[
          colDefs.id,
          colDefs.factory,
          colDefs.inputTwinClass,
          colDefs.factoryConditionSet,
          colDefs.twinFactoryConditionInvert,
          colDefs.active,
          colDefs.description,
          ...(twinTriggerId ? [] : [colDefs.twinTrigger]),
          colDefs.async,
          actionsCol,
        ]}
        fetcher={fetchFactoryTriggers}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.factory,
          colDefs.inputTwinClass,
          colDefs.factoryConditionSet,
          colDefs.twinFactoryConditionInvert,
          colDefs.active,
          colDefs.description,
          ...(twinTriggerId ? [] : [colDefs.twinTrigger]),
          colDefs.async,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={chartGroupings}
        grouping={grouping}
        getRowId={(row) => row.id!}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/factory-triggers/${row.id}`)
        }
        getRowHref={(row) => `/${PlatformArea.core}/factory-triggers/${row.id}`}
        dialogForm={triggersForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <TriggersFormFields control={triggersForm.control} />
        )}
      />

      <FactoryTriggerDuplicateDialog ref={duplicateDialogRef} />
      <FactoryTriggerExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
