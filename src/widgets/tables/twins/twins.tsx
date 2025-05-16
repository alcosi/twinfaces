import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FaceWT001 } from "@/entities/face";
import {
  DYNAMIC_FIELDS_MAP,
  STATIC_TWIN_FIELD_KEY_TO_ID_MAP,
  TWIN_SCHEMA,
  TwinFormValues,
  useCreateTwin,
  useTwinFilters,
  useTwinSearchV3,
} from "@/entities/twin";
import {
  TwinClass_DETAILED,
  useFetchTwinClassById,
} from "@/entities/twin-class";
import { TwinClassField } from "@/entities/twin-class-field";
import { TwinCreateRq, Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TransitionPerformer } from "@/features/twin-flow-transition";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { formatIntlDate, isPopulatedArray, isUndefined } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TwinFormFields } from "./form-fields";

type Props = {
  title?: string;
  enabledColumns?: FaceWT001["columns"];
  // NOTE: Filtering criteria for retrieving related twins
  baseTwinClassId?: string;
  targetHeadTwinId?: string;
};

export function TwinsTable({
  title,
  enabledColumns,
  baseTwinClassId,
  targetHeadTwinId,
}: Props) {
  const tableRef = useRef<DataTableHandle>(null);
  const [twinClassFields, setTwinClassFields] = useState<
    TwinClass_DETAILED["fields"]
  >([]);
  const { buildFilterFields, mapFiltersToPayload } = useTwinFilters(
    baseTwinClassId,
    twinClassFields
  );
  const { fetchTwinClassById } = useFetchTwinClassById();
  const { searchTwins } = useTwinSearchV3();
  const { createTwin } = useCreateTwin();

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
            <TwinClassStatusResourceLink
              data={original.status}
              twinClassId={original.twinClassId!}
              withTooltip
            />
          )}
          {isPopulatedArray(original.transitions) && (
            <TransitionPerformer
              twin={original}
              onSuccess={handleOnTransitionPerformSuccess}
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
            <UserResourceLink data={original.authorUser as User} withTooltip />
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
            <TwinResourceLink data={original.headTwin} withTooltip />
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
              <DatalistOptionResourceLink key={tag.id} data={tag} />
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
          (acc, { twinClassFieldId: fieldId }) => {
            const colDef = fieldId ? staticColDefs[fieldId] : undefined;
            if (fieldId && colDef) {
              acc.push([fieldId, colDef]);
            }
            return acc;
          },
          []
        )
      )
    : staticColDefs;
  const [columnMap, setColumnMap] = useState(staticFieldColumnMap);
  const defaultVisibleColumns = enabledColumns
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
      // TODO: remove this when the BE supports all dynamic filters
      const supportedFields: TwinClassField[] = [];

      const columns = Object.fromEntries(
        fields.reduce<[string, ColumnDef<Twin_DETAILED>][]>((acc, field) => {
          const isEnabled = enabledColumns.some(
            (col) => col.twinClassFieldId === field.id
          );

          if (isEnabled) {
            if (
              field.descriptor?.fieldType &&
              field.descriptor.fieldType in DYNAMIC_FIELDS_MAP
            ) {
              supportedFields.push(field);
            }

            if (field.id && field.key) {
              acc.push([
                field.id,
                {
                  id: field.id,
                  accessorFn: (row) => row.fields?.[field.key!] ?? null,
                  header: field.name,
                },
              ]);
            }
          }

          return acc;
        }, [])
      );

      setTwinClassFields(supportedFields);
      setColumnMap((prev) => ({ ...prev, ...columns }));
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
    defaultValues: {
      classId: "",
      name: "",
      description: "",
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

  return (
    <CrudDataTable
      ref={tableRef}
      title={title}
      columns={Object.values(columnMap)}
      getRowId={(row) => row.id}
      fetcher={(pagination, filters) => fetchTwins({ pagination, filters })}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={defaultVisibleColumns}
      dialogForm={form}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinFormFields
          control={form.control}
          baseTwinClassId={baseTwinClassId}
        />
      )}
    />
  );
}
