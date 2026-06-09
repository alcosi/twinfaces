import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Copy, EllipsisVertical, FolderUp, Unplug } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import {
  TWIN_CLASS_STATUS_SCHEMA,
  TwinClassStatusFormValues,
  TwinStatusCountGroup,
  TwinStatusCreateRq,
  TwinStatusFilterKeys,
  TwinStatus_DETAILED,
  useStatusCreate,
  useStatusFilters,
  useTwinStatusCount,
  useTwinStatusSearchV1,
} from "@/entities/twin-status";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { ImageWithFallback } from "@/features/ui/image-with-fallback";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";
import {
  Button,
  ColorTile,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PieChartDatum,
  getPieChartColor,
} from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
} from "../../crud-data-table";
import { TwinClassStatusFormFields } from "./form-fields";
import {
  TwinClassStatusesDuplicateDialog,
  TwinClassStatusesDuplicateDialogRef,
} from "./twin-class-statuses-duplicate-dialog";
import {
  TwinClassStatusExportSqlDialogRef,
  TwinClassStatusesExportSqlDialog,
} from "./twin-class-statuses-export-sql";

function ThemeIconCell({ data }: { data: TwinStatus_DETAILED }) {
  const { resolvedTheme } = useTheme();

  const themeIcon =
    resolvedTheme === "light"
      ? data.iconLight
      : resolvedTheme === "dark"
        ? data.iconDark
        : undefined;

  return (
    <ImageWithFallback
      src={themeIcon as string}
      alt={themeIcon as string}
      fallbackContent={<Unplug />}
      width={32}
      height={32}
      className="text-[0]"
    />
  );
}

const UNSET_GROUP_LABEL = "— Not set —";

/** Maps server-aggregated count groups into sorted, colored pie-chart slices. */
function mapCountToSlices(
  groups: TwinStatusCountGroup[],
  getId: (group: TwinStatusCountGroup) => string | undefined,
  getLabel: (group: TwinStatusCountGroup) => string | undefined,
  renderLabel?: (group: TwinStatusCountGroup) => ReactNode
): PieChartDatum[] {
  return groups
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((group, index) => ({
      label: getLabel(group) ?? getId(group) ?? UNSET_GROUP_LABEL,
      value: group.count,
      color: getPieChartColor(index),
      legendContent: renderLabel?.(group),
    }));
}

/** Renders a tri-state boolean group label, leaving unset groups to fall back. */
function boolLabel(
  value: boolean | undefined,
  yes: string,
  no: string
): string | undefined {
  return value == null ? undefined : value ? yes : no;
}

const colDefs: Record<
  keyof Pick<
    TwinStatus_DETAILED,
    | "iconLight"
    | "id"
    | "key"
    | "name"
    | "twinClassId"
    | "description"
    | "backgroundColor"
    | "fontColor"
  >,
  ColumnDef<TwinStatus_DETAILED>
> = {
  iconLight: {
    id: "logo",
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row: { original } }) => <ThemeIconCell data={original} />,
  },

  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: () => <SortableHeader title="Class" sortField="twinClassName" />,
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },

  key: {
    id: "key",
    accessorKey: "key",
    header: () => <SortableHeader title="Key" sortField="key" />,
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
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

  backgroundColor: {
    id: "backgroundColor",
    accessorKey: "backgroundColor",
    header: () => (
      <SortableHeader title="Background Color" sortField="backgroundColor" />
    ),
    cell: (data) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <ColorTile color={data.getValue<string>()} />
          </TooltipTrigger>
          <TooltipContent>{data.getValue<string>()}</TooltipContent>
        </Tooltip>
      );
    },
  },

  fontColor: {
    id: "fontColor",
    accessorKey: "fontColor",
    header: () => <SortableHeader title="Font Color" sortField="fontColor" />,
    cell: (data) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <ColorTile color={data.getValue<string>()} />
          </TooltipTrigger>
          <TooltipContent>{data.getValue<string>()}</TooltipContent>
        </Tooltip>
      );
    },
  },
};

export function TwinClassStatusesTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const duplicateDialogRef = useRef<TwinClassStatusesDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<TwinClassStatusExportSqlDialogRef>(null);
  const { searchTwinStatuses } = useTwinStatusSearchV1();
  const { countTwinStatuses } = useTwinStatusCount();
  const { createStatus } = useStatusCreate();
  const { buildFilterFields, mapFiltersToPayload } = useStatusFilters({
    enabledFilters: isTruthy(twinClassId)
      ? ["idList", "keyLikeList", "nameI18nLikeList", "descriptionI18nLikeList"]
      : undefined,
  });

  // Resolves the table filters into a search payload, scoping to the current
  // twin class when the table is rendered inside a class. Shared by the data
  // fetch and the chart count.
  const resolveFilters = useCallback(
    (rawFilters: Record<string, unknown>) => {
      const _filters = mapFiltersToPayload(
        rawFilters as Record<TwinStatusFilterKeys, unknown>
      );

      return {
        ..._filters,
        twinClassIdMap: twinClassId
          ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
          : _filters.twinClassIdMap,
      };
    },
    [mapFiltersToPayload, twinClassId]
  );

  // Server-side pie-chart breakdowns backed by /private/twin_status/count/v1,
  // bound to the active filters (and the optional scoping twin class).
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(filters);

      return [
        {
          key: "twinClass",
          label: "Class",
          load: async () =>
            mapCountToSlices(
              await countTwinStatuses({
                filters: resolved,
                groupField: "twinClassId",
              }),
              (g) => g.twinClassId,
              (g) => g.twinClass?.name,
              (g) =>
                g.twinClass && (
                  <TwinClassResourceLink
                    data={g.twinClass as TwinClass_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "inheritable",
          label: "Inheritable",
          load: async () =>
            mapCountToSlices(
              await countTwinStatuses({
                filters: resolved,
                groupField: "inheritable",
              }),
              (g) => boolLabel(g.inheritable, "Inheritable", "Not inheritable"),
              (g) => boolLabel(g.inheritable, "Inheritable", "Not inheritable")
            ),
        },
        {
          key: "type",
          label: "Type",
          load: async () =>
            mapCountToSlices(
              await countTwinStatuses({
                filters: resolved,
                groupField: "type",
              }),
              (g) => g.type,
              (g) => g.type
            ),
        },
      ];
    },
    [countTwinStatuses, resolveFilters]
  );

  const form = useForm<TwinClassStatusFormValues>({
    resolver: zodResolver(TWIN_CLASS_STATUS_SCHEMA),
    defaultValues: {
      twinClassId: twinClassId || "",
      key: "",
      name: "",
      description: "",
      // logo: "",
      backgroundColor: "#000000",
      fontColor: "#000000",
    },
  });

  async function fetchStatuses(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinStatus_DETAILED>> {
    try {
      return await searchTwinStatuses({
        pagination,
        filters: resolveFilters(filters.filters),
        sort,
      });
    } catch {
      toast.error("Failed to fetch statuses");
      return { data: [], pagination: {} };
    }
  }

  async function handleCreate(formValues: TwinClassStatusFormValues) {
    const data: TwinStatusCreateRq = {
      key: formValues.key,
      nameI18n: {
        translationInCurrentLocale: formValues.name,
        translations: {},
      },
      descriptionI18n: {
        translationInCurrentLocale: formValues.description,
        translations: {},
      },
      // logo: formValues.logo,
      backgroundColor: formValues.backgroundColor,
      fontColor: formValues.fontColor,
    };

    if (!formValues.twinClassId) {
      toast.error("Twin class ID is missing");
      return;
    }

    await createStatus({
      twinClassId: twinClassId || formValues.twinClassId!,
      body: data,
    });

    toast.success("Status created successfully!");
    fetchStatuses({ pageIndex: 0, pageSize: 10 }, { filters: {} });
  }

  const actionsCol: ColumnDef<TwinStatus_DETAILED> = {
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
                exportSqlDialogRef.current?.open(original);
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

  return (
    <>
      <CrudDataTable
        permissionSegment="statuses"
        title="Statuses"
        ref={tableRef}
        columns={[
          colDefs.iconLight,
          colDefs.id,
          colDefs.twinClassId,
          colDefs.key,
          colDefs.name,
          colDefs.description,
          colDefs.backgroundColor,
          colDefs.fontColor,
          actionsCol,
        ]}
        getRowId={(row) => row.id!}
        fetcher={fetchStatuses}
        chartGroupings={buildChartGroupings}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/statuses/${row.id}`)
        }
        filters={{
          filtersInfo: buildFilterFields(),
        }}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.twinClassId,
          colDefs.key,
          colDefs.name,
          colDefs.description,
          colDefs.backgroundColor,
          colDefs.fontColor,
          actionsCol,
        ]}
        dialogForm={form}
        onCreateSubmit={handleCreate}
        renderFormFields={() => (
          <TwinClassStatusFormFields control={form.control} />
        )}
      />

      <TwinClassStatusesDuplicateDialog
        ref={duplicateDialogRef}
        onSuccess={() => tableRef.current?.refresh()}
      />

      <TwinClassStatusesExportSqlDialog
        ref={exportSqlDialogRef}
        onSuccess={() => tableRef.current?.refresh()}
      />
    </>
  );
}
