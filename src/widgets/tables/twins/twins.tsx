import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  TWIN_SCHEMA,
  TwinFormValues,
  useCreateTwin,
  useTwinFilters,
  useTwinSearchBySearchId,
  useTwinSearchV3,
} from "@/entities/twin";
import {
  TwinClass_DETAILED,
  useFetchTwinClassById,
} from "@/entities/twin-class";
import { Twin, TwinCreateRq, Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TransitionPerformer } from "@/features/twin-flow-transition";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import {
  formatIntlDate,
  isPopulatedArray,
  isTruthy,
  isUndefined,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TwinFormFields } from "./form-fields";

type TwinStaticFieldKey = keyof Pick<
  Twin,
  | "id"
  | "twinClassId"
  | "name"
  | "statusId"
  | "description"
  | "authorUserId"
  | "assignerUserId"
  | "headTwinId"
  | "tags"
  | "markers"
  | "createdAt"
  | "aliases"
>;

function filterValidKeys(keys: string[]): TwinStaticFieldKey[] {
  const validKeys: TwinStaticFieldKey[] = [
    "id",
    "twinClassId",
    "name",
    "statusId",
    "description",
    "authorUserId",
    "assignerUserId",
    "headTwinId",
    "tags",
    "markers",
    "createdAt",
    "aliases",
  ];
  return keys.filter((key): key is TwinStaticFieldKey =>
    validKeys.includes(key as TwinStaticFieldKey)
  );
}

type Props = {
  title?: string;
  enabledColumns?: string[];
  // NOTE: Filtering criteria for retrieving related twins
  baseTwinClassId?: string;
  targetHeadTwinId?: string;
  searchId?: string;
};

export function TwinsTable({
  title,
  enabledColumns,
  baseTwinClassId,
  targetHeadTwinId,
  searchId,
}: Props) {
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } =
    useTwinFilters(baseTwinClassId);
  const { fetchTwinClassById } = useFetchTwinClassById();
  const { searchTwins } = useTwinSearchV3();
  const { searchTwinsBySearchId } = useTwinSearchBySearchId();
  const { createTwin } = useCreateTwin();

  const colDefs: Record<TwinStaticFieldKey, ColumnDef<Twin_DETAILED>> = {
    id: {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: (data) => <GuidWithCopy value={data.row.original.id} />,
    },

    twinClassId: {
      id: "twinClassId",
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

    aliases: {
      id: "aliases",
      accessorKey: "aliases",
      header: "Alias",
    },

    name: {
      id: "name",
      accessorKey: "name",
      header: "Name",
    },

    statusId: {
      id: "statusId",
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

    authorUserId: {
      id: "authorUserId",
      accessorKey: "authorUserId",
      header: "Author",
      cell: ({ row: { original } }) =>
        original.authorUser && (
          <div className="inline-flex max-w-48">
            <UserResourceLink data={original.authorUser as User} withTooltip />
          </div>
        ),
    },

    assignerUserId: {
      id: "assignerUserId",
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

    headTwinId: {
      id: "headTwinId",
      accessorKey: "headTwinId",
      header: "Head",
      cell: ({ row: { original } }) =>
        original.headTwinId && original.headTwin ? (
          <div className="inline-flex max-w-48">
            <TwinResourceLink data={original.headTwin} withTooltip />
          </div>
        ) : null,
    },

    tags: {
      id: "tags",
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

    markers: {
      id: "markers",
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

    createdAt: {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row: { original } }) =>
        original.createdAt &&
        formatIntlDate(original.createdAt, "datetime-local"),
    },
  };

  const staticKeys = filterValidKeys(enabledColumns ?? []);
  const [columnMap, setColumnMap] = useState(
    enabledColumns
      ? Object.fromEntries(staticKeys.map((key) => [key, colDefs[key]]))
      : colDefs
  );

  useEffect(() => {
    if (isUndefined(baseTwinClassId)) return;

    fetchTwinClassById({
      id: baseTwinClassId,
      query: {
        showTwinClassMode: "SHORT",
        showTwinClass2TwinClassFieldMode: "DETAILED",
      },
    }).then((twinClass) => {
      const twinClassFields = twinClass.fields ?? [];
      setColumnMap((prev) => ({
        ...prev,
        ...Object.fromEntries(
          twinClassFields.map((field) => [
            field.key,
            {
              id: field.key,
              accessorKey: `fields.${field.key}`,
              header: field.name,
            },
          ])
        ),
      }));
    });
  }, []);

  async function fetchTwins({
    pagination,
    filters,
    searchId,
  }: {
    pagination?: PaginationState;
    filters: FiltersState;
    searchId?: string;
  }) {
    const _filters = mapFiltersToPayload(filters.filters);

    const filtersPayload = {
      ..._filters,
      twinClassExtendsHierarchyContainsIdList: baseTwinClassId
        ? [baseTwinClassId]
        : _filters.twinClassExtendsHierarchyContainsIdList,
      headTwinIdList: targetHeadTwinId
        ? [targetHeadTwinId]
        : _filters.headTwinIdList,
    };

    try {
      if (isTruthy(searchId)) {
        return await searchTwinsBySearchId({
          pagination: pagination,
          filters: filtersPayload,
          searchId: searchId,
        });
      } else {
        return await searchTwins({
          pagination: pagination,
          filters: filtersPayload,
        });
      }
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
      fetcher={(pagination, filters) =>
        fetchTwins({ pagination, filters, searchId })
      }
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={Object.values(columnMap)}
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
