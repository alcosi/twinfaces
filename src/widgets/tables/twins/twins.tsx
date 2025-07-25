import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FaceTC001ViewRs, FaceWT001 } from "@/entities/face";
import {
  STATIC_TWIN_FIELD_ID_TO_FILTERS_KEY_MAP,
  STATIC_TWIN_FIELD_KEY_TO_ID_MAP,
  TWIN_CLASS_FIELD_TYPE_TO_SEARCH_PAYLOAD,
  TWIN_SCHEMA,
  TwinFormValues,
  TwinSelfFieldId,
  useCreateTwin,
  useTwinFilters,
  useTwinSearchV3,
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
import {
  TwinFieldEditor,
  TwinResourceLink,
  TwinStatusActions,
} from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import {
  formatIntlDate,
  isEmptyString,
  isPopulatedArray,
  isUndefined,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TCForm } from "../../faces/widgets/views/tc";
import { TwinFormFields } from "./form-fields";

type Props = {
  title?: string;
  enabledColumns?: FaceWT001["columns"];
  showCreateButton?: boolean;
  resourceNavigationEnabled?: boolean;
  // === start === NOTE: Filtering criteria for retrieving related twins
  baseTwinClassId?: string;
  targetHeadTwinId?: string;
  // === end ===
  modalCreateData?: FaceTC001ViewRs;
  onRowClick?: (row: Twin_DETAILED) => void;
};

export function TwinsTable({
  title,
  enabledColumns,
  baseTwinClassId,
  targetHeadTwinId,
  showCreateButton = true,
  resourceNavigationEnabled = true,
  modalCreateData,
  onRowClick,
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
  const { searchTwins } = useTwinSearchV3();
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.id]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.id,
      accessorKey: "id",
      header: "ID",
      cell: (data) => <GuidWithCopy value={data.row.original.id} />,
    },
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.twinClassId]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.twinClassId,
      accessorKey: "twinClassId",
      header: "Twin class",
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.aliases]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.aliases,
      accessorKey: "aliases",
      header: "Alias",
    },
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.name]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.name,
      accessorKey: "name",
      header: "Name",
    },
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.statusId]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.statusId,
      accessorKey: "statusId",
      header: "Status",
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.description]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.description,
      accessorKey: "description",
      header: "Description",
      cell: ({ row: { original } }) =>
        original.description && (
          <div className="text-muted-foreground line-clamp-2 max-w-64">
            {original.description}
          </div>
        ),
    },
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.authorUserId]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.authorUserId,
      accessorKey: "authorUserId",
      header: "Author",
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.assignerUserId]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.assignerUserId,
      accessorKey: "assignerUserId",
      header: "Assignee",
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.headTwinId]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.headTwinId,
      accessorKey: "headTwinId",
      header: "Head",
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.tags]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.tags,
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.markers]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.markers,
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
    [STATIC_TWIN_FIELD_KEY_TO_ID_MAP.createdAt]: {
      id: STATIC_TWIN_FIELD_KEY_TO_ID_MAP.createdAt,
      accessorKey: "createdAt",
      header: "Created at",
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
                  header: label ?? colDef.header,
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

  async function fetchTwins({
    pagination,
    filters,
  }: {
    pagination?: PaginationState;
    filters: FiltersState;
  }) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwins({
        pagination: pagination,
        filters: {
          ..._filters,
          twinClassExtendsHierarchyContainsIdList: baseTwinClassId
            ? [baseTwinClassId]
            : _filters.twinClassExtendsHierarchyContainsIdList,
          headTwinIdList: targetHeadTwinId
            ? [targetHeadTwinId]
            : _filters.headTwinIdList,
        },
      });
    } catch (e) {
      toast.error("Failed to fetch twins");
      return { data: [], pagination: {} };
    }
  }

  const form = useForm<TwinFormValues>({
    resolver: zodResolver(TWIN_SCHEMA),
    defaultValues: { classId: "", name: "", description: "" },
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
      ref={tableRef}
      title={title}
      columns={
        isPopulatedArray(orderedColumns)
          ? orderedColumns
          : Object.values(columnMap)
      }
      getRowId={(row) => row.id}
      fetcher={(pagination, filters) => fetchTwins({ pagination, filters })}
      filters={{
        filtersInfo: buildFilterFields(enabledFilters),
      }}
      defaultVisibleColumns={defaultVisibleColumns}
      dialogForm={form}
      onCreateSubmit={showCreateButton ? handleOnCreateSubmit : undefined}
      onRowClick={onRowClick}
      renderFormFields={() =>
        modalCreateData ? (
          <TCForm control={form.control} modalCreateData={modalCreateData} />
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
          header: column.label ?? field.key,
          cell: ({ row: { original } }) => {
            const twinField = original.fields?.[field.key!] as TwinFieldUI;

            if (isEmptyString(twinField.value)) {
              return twinField.value;
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
