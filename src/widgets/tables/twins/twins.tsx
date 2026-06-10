import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FaceTC001ViewRs, FaceWT001 } from "@/entities/face";
import {
  STATIC_TWIN_FIELD_ID_TO_FILTERS_KEY_MAP,
  TWIN_CLASS_FIELD_TYPE_TO_SEARCH_PAYLOAD,
  TWIN_SCHEMA,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP,
  TwinFormValues,
  TwinSelfFieldId,
  useCreateTwin,
  useTwinCount,
  useTwinFilters,
  useTwinSearch,
} from "@/entities/twin";
import {
  TwinClass_DETAILED,
  useFetchTwinClassById,
} from "@/entities/twin-class";
import { TwinClassField } from "@/entities/twin-class-field";
import {
  TwinCreateRq,
  TwinFilterKeys,
  Twin_DETAILED,
} from "@/entities/twin/server";
import { TwinFieldUI } from "@/entities/twinField";
import { User } from "@/entities/user";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import {
  TwinFieldEditor,
  TwinResourceLink,
  TwinStatusActions,
} from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import {
  formatIntlDate,
  isEmptyString,
  isPopulatedArray,
  isUndefined,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";
import { TC001Form } from "../../faces/widgets/views/index.client";
import { TwinFormFields } from "./form-fields";

// Default header titles for the twin self (static) columns, keyed by field id.
const STATIC_FIELD_TITLES: Record<string, string> = {
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.id]: "ID",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId]: "Twin class",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.aliases]: "Alias",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.name]: "Name",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId]: "Status",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.description]: "Description",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId]: "Author",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId]: "Assignee",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId]: "Head",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.tags]: "Tags",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.markers]: "Markers",
  [TWIN_SELF_FIELD_KEY_TO_ID_MAP.createdAt]: "Created at",
};

// Static columns the v4 search can sort on. Sorting is expressed via the
// field's TwinClassFieldId, so the field id doubles as the sort key.
const SORTABLE_STATIC_FIELD_IDS = new Set<string>([
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.name,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.description,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId,
  TWIN_SELF_FIELD_KEY_TO_ID_MAP.createdAt,
]);

/**
 * Builds a column header for a static field: a sortable header (sorting by the
 * field id) when the field supports it, otherwise the plain title. Keeps the
 * sortable behaviour intact even when a custom column label is supplied.
 */
function renderTwinHeader(
  fieldId: string,
  title: string
): ColumnDef<Twin_DETAILED>["header"] {
  if (SORTABLE_STATIC_FIELD_IDS.has(fieldId)) {
    return function () {
      return <SortableHeader title={title} sortField={fieldId} />;
    };
  }
  return title;
}

type Props = {
  title?: string;
  enabledColumns?: FaceWT001["columns"];
  showCreateButton?: boolean;
  resourceNavigationEnabled?: boolean;
  // === start === NOTE: Filtering criteria for retrieving related twins
  baseTwinClassId?: string;
  baseTwinClassIdList?: string[];
  targetHeadTwinId?: string;
  searchId?: string;
  searchParams?: Record<string, string>;
  // === end ===
  modalCreateData?: FaceTC001ViewRs;
  onRowClick?: (row: Twin_DETAILED) => void;
  businessAccountId?: string;
};

export function TwinsTable({
  title = "Twins",
  enabledColumns,
  baseTwinClassId,
  baseTwinClassIdList,
  targetHeadTwinId,
  showCreateButton = true,
  resourceNavigationEnabled = true,
  modalCreateData,
  onRowClick,
  searchId,
  searchParams = {},
  businessAccountId,
}: Props) {
  const tableRef = useRef<DataTableHandle>(null);
  const [twinClassFields, setTwinClassFields] = useState<
    TwinClass_DETAILED["fields"]
  >([]);
  // NOTE: `twinClassFields` is passed directly into `useTwinFilters`, which may trigger unnecessary recomputations.
  // If this component becomes a performance bottleneck, consider memoizing `twinClassFields` via `useMemo`.
  const { buildFilterFields, mapFiltersToPayload } = useTwinFilters({
    baseTwinClassId,
    twinClassFields,
    enabledColumns,
  });
  const { fetchTwinClassById } = useFetchTwinClassById();
  const { searchTwins, searchTwinBySearchId } = useTwinSearch();
  const { countTwins } = useTwinCount();
  const { createTwin } = useCreateTwin();

  const enabledFilters = isPopulatedArray(enabledColumns)
    ? enabledColumns.reduce((acc: TwinFilterKeys[], col) => {
        const fieldId = col.twinClassFieldId as TwinSelfFieldId;
        const key = STATIC_TWIN_FIELD_ID_TO_FILTERS_KEY_MAP[fieldId];

        if (!isUndefined(key)) acc.push(key);

        return acc;
      }, [])
    : undefined;

  const staticColDefs: Record<string, ColumnDef<Twin_DETAILED>> = {
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.id]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.id,
      accessorKey: "id",
      header: "ID",
      cell: (data) => <GuidWithCopy value={data.row.original.id} />,
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId,
      accessorKey: "twinClassId",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId,
        "Twin class"
      ),
      cell: ({ row: { original } }) =>
        original.twinClass && (
          <div className="inline-flex max-w-48">
            <TwinClassResourceLink
              data={original.twinClass as TwinClass_DETAILED}
              withTooltip
              disabled={!resourceNavigationEnabled}
            />
          </div>
        ),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.aliases]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.aliases,
      accessorKey: "aliases",
      header: "Alias",
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.name]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.name,
      accessorKey: "name",
      header: renderTwinHeader(TWIN_SELF_FIELD_KEY_TO_ID_MAP.name, "Name"),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId,
      accessorKey: "statusId",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId,
        "Status"
      ),
      cell: ({ row: { original } }) => (
        <div className="inline-flex max-w-48 items-center gap-2">
          {original.status && (
            <TwinStatusActions
              twin={original}
              allowNavigation={!resourceNavigationEnabled}
              onTransitionSuccess={handleOnTransitionPerformSuccess}
            />
          )}
        </div>
      ),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.description]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.description,
      accessorKey: "description",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.description,
        "Description"
      ),
      cell: ({ row: { original } }) =>
        original.description && (
          <div className="text-muted-foreground line-clamp-2 max-w-64">
            {original.description}
          </div>
        ),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId,
      accessorKey: "authorUserId",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId,
        "Author"
      ),
      cell: ({ row: { original } }) =>
        original.authorUser && (
          <div className="inline-flex max-w-48">
            <UserResourceLink
              data={original.authorUser as User}
              withTooltip
              disabled={!resourceNavigationEnabled}
            />
          </div>
        ),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId,
      accessorKey: "assignerUserId",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId,
        "Assignee"
      ),
      cell: ({ row: { original } }) =>
        original.assignerUser && (
          <div className="inline-flex max-w-48">
            <UserResourceLink
              data={original.assignerUser as User}
              withTooltip
              disabled={!resourceNavigationEnabled}
            />
          </div>
        ),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId,
      accessorKey: "headTwinId",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId,
        "Head"
      ),
      cell: ({ row: { original } }) =>
        original.headTwinId && original.headTwin ? (
          <div className="inline-flex max-w-48">
            <TwinResourceLink
              data={original.headTwin}
              withTooltip
              disabled={!resourceNavigationEnabled}
            />
          </div>
        ) : null,
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.tags]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.tags,
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row: { original } }) =>
        isPopulatedArray(original.tags) && (
          <div className="inline-flex max-w-48 flex-wrap gap-2">
            {original.tags.map((tag) => (
              <DatalistOptionResourceLink
                key={tag.id}
                data={tag}
                disabled={!resourceNavigationEnabled}
              />
            ))}
          </div>
        ),
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.markers]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.markers,
      accessorKey: "markers",
      header: "Markers",
      cell: ({ row: { original } }) =>
        original.markerIdList && original.markers ? (
          <div className="inline-flex max-w-48">
            <DatalistOptionResourceLink
              data={{
                ...original.markers,
                dataListId: original.twinClass?.markersDataListId,
              }}
              withTooltip
              disabled={!resourceNavigationEnabled}
            />
          </div>
        ) : null,
    },
    [TWIN_SELF_FIELD_KEY_TO_ID_MAP.createdAt]: {
      id: TWIN_SELF_FIELD_KEY_TO_ID_MAP.createdAt,
      accessorKey: "createdAt",
      header: renderTwinHeader(
        TWIN_SELF_FIELD_KEY_TO_ID_MAP.createdAt,
        "Created at"
      ),
      cell: ({ row: { original } }) =>
        original.createdAt &&
        formatIntlDate(original.createdAt, "datetime-local"),
    },
  };
  const staticFieldColumnMap = isPopulatedArray(enabledColumns)
    ? Object.fromEntries(
        enabledColumns.reduce<[string, ColumnDef<Twin_DETAILED>][]>(
          (acc, { twinClassFieldId: fieldId, label }) => {
            const colDef = fieldId ? staticColDefs[fieldId] : undefined;
            if (fieldId && colDef) {
              acc.push([
                fieldId,
                {
                  ...colDef,
                  header: renderTwinHeader(
                    fieldId,
                    label ?? STATIC_FIELD_TITLES[fieldId] ?? fieldId
                  ),
                } as ColumnDef<Twin_DETAILED>,
              ]);
            }
            return acc;
          },
          []
        )
      )
    : staticColDefs;
  const [columnMap, setColumnMap] = useState(staticFieldColumnMap);
  const defaultVisibleColumns = isPopulatedArray(enabledColumns)
    ? enabledColumns.reduce<ColumnDef<Twin_DETAILED>[]>((acc, col) => {
        if (col.showByDefault && col.twinClassFieldId) {
          const def = columnMap[col.twinClassFieldId];
          if (def) acc.push(def);
        }
        return acc;
      }, [])
    : Object.values(staticColDefs);

  useEffect(() => {
    if (isUndefined(baseTwinClassId) || !isPopulatedArray(enabledColumns))
      return;

    fetchTwinClassById({
      id: baseTwinClassId,
      query: {
        showTwinClassMode: "SHORT",
        showTwinClass2TwinClassFieldMode: "DETAILED",
        showTwinClassFieldCollectionMode: "SHOW",
      },
    }).then(({ fields = [] }) => {
      const { supportedFields, columnEntries } =
        extractTwinFieldColumnsAndFilters({
          fields,
          enabledColumns,
          resourceNavigationEnabled,
        });

      setTwinClassFields(supportedFields);
      setColumnMap((prev) => ({
        ...prev,
        ...Object.fromEntries(columnEntries),
      }));
    });
  }, [baseTwinClassId, enabledColumns, fetchTwinClassById]);

  // Resolves the table filters into a search payload, applying the
  // component-level scoping overrides (base twin class, head twin, owner
  // business account). Shared by the data fetch and the chart count.
  const resolveTwinFilters = useCallback(
    (rawFilters: Record<string, unknown>) => {
      const _baseFilters = mapFiltersToPayload(
        rawFilters as Record<TwinFilterKeys, unknown>
      );

      return {
        ..._baseFilters,
        twinClassExtendsHierarchyContainsIdList: baseTwinClassIdList
          ? baseTwinClassIdList
          : baseTwinClassId
            ? [baseTwinClassId]
            : _baseFilters.twinClassExtendsHierarchyContainsIdList,
        headTwinIdList: targetHeadTwinId
          ? [targetHeadTwinId]
          : _baseFilters.headTwinIdList,
        ownerBusinessAccountIdList: businessAccountId
          ? [businessAccountId]
          : undefined,
      };
    },
    [
      mapFiltersToPayload,
      baseTwinClassId,
      baseTwinClassIdList,
      targetHeadTwinId,
      businessAccountId,
    ]
  );

  async function fetchTwins({
    pagination,
    filters,
    sort,
  }: {
    pagination?: PaginationState;
    filters: FiltersState;
    sort?: SortV1;
  }): Promise<PagedResponse<Twin_DETAILED>> {
    const resolvedFilters = resolveTwinFilters(filters.filters);

    try {
      // The search-by-id endpoint does not support sorting by field id.
      return searchId
        ? await searchTwinBySearchId({
            searchId,
            searchParams,
            pagination,
            filters: resolvedFilters,
          })
        : await searchTwins({
            pagination,
            filters: resolvedFilters,
            sort,
          });
    } catch {
      toast.error("Failed to fetch twins");
      return { data: [], pagination: {} };
    }
  }

  // Server-side pie-chart breakdowns backed by /private/twin/count/v1, bound to
  // the active filters. Only static fields whose grouped value the count
  // response models are offered; dynamic-field grouping is not yet returned by
  // the endpoint, though dynamic fields remain sortable.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveTwinFilters(filters);

      return [
        {
          key: "status",
          label: "Status",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwins({
                filters: resolved,
                groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId,
                offset,
                limit,
              }),
            (g) => g.twinStatusId,
            (g) => g.status?.name,
            (g) =>
              g.status && (
                <TwinClassStatusResourceLink data={g.status} withTooltip />
              )
          ),
        },
        {
          key: "twinClass",
          label: "Twin class",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwins({
                filters: resolved,
                groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId,
                offset,
                limit,
              }),
            (g) => g.twinClassId,
            (g) => g.twinClass?.name,
            (g) =>
              g.twinClass && (
                <TwinClassResourceLink data={g.twinClass} withTooltip />
              )
          ),
        },
        {
          key: "assignee",
          label: "Assignee",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwins({
                filters: resolved,
                groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId,
                offset,
                limit,
              }),
            (g) => g.assignerUserId,
            (g) => g.assignerUser?.fullName,
            (g) =>
              g.assignerUser && (
                <UserResourceLink data={g.assignerUser} withTooltip />
              )
          ),
        },
        {
          key: "author",
          label: "Author",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwins({
                filters: resolved,
                groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId,
                offset,
                limit,
              }),
            (g) => g.createdByUserId,
            (g) => g.createdByUser?.fullName,
            (g) =>
              g.createdByUser && (
                <UserResourceLink data={g.createdByUser} withTooltip />
              )
          ),
        },
        {
          key: "head",
          label: "Head",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwins({
                filters: resolved,
                groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId,
                offset,
                limit,
              }),
            (g) => g.headTwinId,
            (g) => g.headTwin?.name,
            (g) =>
              g.headTwin && <TwinResourceLink data={g.headTwin} withTooltip />
          ),
        },
      ];
    },
    [countTwins, resolveTwinFilters]
  );

  const form = useForm<TwinFormValues>({
    resolver: zodResolver(TWIN_SCHEMA),
    defaultValues: {
      classId: "",
      name: "",
      description: "",
      isSketch: modalCreateData?.faceTwinCreate?.sketchMode,
    },
  });

  async function handleOnCreateSubmit(formValues: TwinFormValues) {
    const body: TwinCreateRq = { ...formValues };

    await createTwin({ body });
    toast.success(`Twin ${body.name} is created successfully!`);
  }

  function handleOnTransitionPerformSuccess() {
    tableRef.current?.resetPage();
    toast.success("Transition is performed successfully");
  }

  const orderedColumns = isPopulatedArray(enabledColumns)
    ? enabledColumns.reduce<ColumnDef<Twin_DETAILED>[]>((acc, col) => {
        const fieldId = col.twinClassFieldId;
        const def = fieldId ? columnMap[fieldId] : undefined;
        if (def) acc.push(def);
        return acc;
      }, [])
    : [];

  return (
    <CrudDataTable
      permissionSegment="twins"
      ref={tableRef}
      title={title}
      columns={
        isPopulatedArray(orderedColumns)
          ? orderedColumns
          : Object.values(columnMap)
      }
      getRowId={(row) => row.id}
      fetcher={(pagination, filters, sort) =>
        fetchTwins({ pagination, filters, sort })
      }
      chartGroupings={buildChartGroupings}
      filters={{
        filtersInfo: buildFilterFields(enabledFilters),
      }}
      defaultVisibleColumns={defaultVisibleColumns}
      dialogForm={form}
      onCreateSubmit={showCreateButton ? handleOnCreateSubmit : undefined}
      onRowClick={onRowClick}
      renderFormFields={() =>
        modalCreateData ? (
          <TC001Form payload={modalCreateData} />
        ) : (
          <TwinFormFields
            control={form.control}
            baseTwinClassId={baseTwinClassId}
          />
        )
      }
      modalTitle={modalCreateData?.faceTwinCreate?.headerLabel}
      submitButtonLabel={modalCreateData?.faceTwinCreate?.saveButtonLabel}
    />
  );
}

function extractTwinFieldColumnsAndFilters({
  fields,
  enabledColumns,
  resourceNavigationEnabled,
}: {
  fields: TwinClassField[];
  enabledColumns: NonNullable<FaceWT001["columns"]>;
  resourceNavigationEnabled: boolean;
}): {
  supportedFields: TwinClassField[];
  columnEntries: [string, ColumnDef<Twin_DETAILED>][];
} {
  return fields.reduce<{
    supportedFields: TwinClassField[];
    columnEntries: [string, ColumnDef<Twin_DETAILED>][];
  }>(
    ({ supportedFields, columnEntries }, field) => {
      const column = enabledColumns.find(
        (col) => col.twinClassFieldId === field.id
      );

      if (
        isUndefined(column) ||
        isUndefined(field.id) ||
        isUndefined(field.key)
      ) {
        return { supportedFields, columnEntries };
      }

      columnEntries.push([
        field.id,
        {
          id: field.key,
          accessorFn: (row) => row.fields?.[field.key!] ?? null,
          // Dynamic fields are sortable on the v4 search via their
          // TwinClassFieldId (`field.id`).
          header: () => (
            <SortableHeader
              title={column.label ?? field.key!}
              sortField={field.id!}
            />
          ),
          cell: ({ row: { original } }) => {
            const twinField = original.fields?.[field.key!] as TwinFieldUI;

            if (isUndefined(twinField) || isEmptyString(twinField.value)) {
              return "";
            }

            return (
              <TwinFieldEditor
                id={twinField.id}
                field={twinField}
                twinId={original.id}
                twin={original}
                editable={false}
                disabled={!resourceNavigationEnabled}
              />
            );
          },
        },
      ]);

      // TODO: remove supportedFields filter once the backend supports all field types for filtering
      const isSearchable =
        field.descriptor?.fieldType &&
        field.descriptor.fieldType in TWIN_CLASS_FIELD_TYPE_TO_SEARCH_PAYLOAD;

      if (isSearchable) {
        supportedFields.push(field);
      }

      return { supportedFields, columnEntries };
    },
    { supportedFields: [], columnEntries: [] }
  );
}
