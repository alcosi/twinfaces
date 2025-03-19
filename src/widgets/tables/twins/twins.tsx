import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { EllipsisVertical, Settings2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TransitionSelector } from "@/components/transition-selector";

import { DatalistOptionResourceLink } from "@/entities/datalist-option";
import {
  TWIN_SCHEMA,
  Twin,
  TwinCreateRq,
  TwinFormValues,
  TwinResourceLink,
  Twin_DETAILED,
  useCreateTwin,
  useTwinFilters,
  useTwinSearchV3,
} from "@/entities/twin";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
  useFetchTwinClassById,
} from "@/entities/twin-class";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { User, UserResourceLink } from "@/entities/user";
import {
  formatToTwinfaceDate,
  isPopulatedArray,
  isUndefined,
} from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TwinFormFields } from "./form-fields";

type TwinTableColumnKey = keyof Pick<
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
  | "transitions"
>;

type Props = {
  title?: string;
  enabledColumns?: TwinTableColumnKey[];
  // NOTE: Filtering criteria for retrieving related twins
  baseTwinClassId?: string;
  targetHeadTwinId?: string;
};

const colDefs: Record<TwinTableColumnKey, ColumnDef<Twin_DETAILED>> = {
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
        <div className="max-w-48 inline-flex">
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
    cell: ({ row: { original } }) =>
      original.status && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.status}
            twinClassId={original.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },

  transitions: {
    id: "changeStatus",
    header: () => <Settings2Icon />,
    accessorKey: "changeStatus",
    cell: ({ row: { original } }) =>
      original.transitions && original.transitions.length > 0 ? (
        <TransitionSelector
          transitions={original.transitions}
          onSelect={(transition) => console.log(transition)}
        />
      ) : null,
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },

  authorUserId: {
    id: "authorUserId",
    accessorKey: "authorUserId",
    header: "Author",
    cell: ({ row: { original } }) =>
      original.authorUser && (
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.assignerUser as User} withTooltip />
        </div>
      ),
  },

  headTwinId: {
    id: "headTwinId",
    accessorKey: "headTwinId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headTwinId && original.headTwin ? (
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex flex-wrap gap-2">
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
        <div className="max-w-48 inline-flex">
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
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function TwinsTable({
  title,
  enabledColumns,
  baseTwinClassId,
  targetHeadTwinId,
}: Props) {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } =
    useTwinFilters(baseTwinClassId);
  const { fetchTwinClassById } = useFetchTwinClassById();
  const { searchTwins } = useTwinSearchV3();
  const { createTwin } = useCreateTwin();

  const [columnMap, setColumnMap] = useState(
    enabledColumns
      ? Object.fromEntries(enabledColumns.map((key) => [key, colDefs[key]]))
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

  const defaultVisibleColumns = useMemo(
    () =>
      Object.values(columnMap).filter(
        (col) =>
          ![
            "twinClassId",
            "description",
            "authorUserId",
            "assignerUserId",
            "headTwinId",
            "createdAt",
          ].includes(col.id!)
      ),
    [columnMap]
  );

  async function fetchTwin({
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

  return (
    <CrudDataTable
      ref={tableRef}
      title={title}
      columns={Object.values(columnMap)}
      getRowId={(row) => row.id}
      fetcher={(pagination, filters) => fetchTwin({ pagination, filters })}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) => router.push(`/workspace/twins/${row.id}`)}
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
