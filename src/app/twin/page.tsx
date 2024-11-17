"use client";

import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import {
  hydrateTwinFromMap,
  Twin,
  TwinResourceLink,
  useTwinFilters,
} from "@/entities/twin";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import {
  TwinClassStatus,
  TwinClassStatusResourceLink,
} from "@/entities/twinClassStatus";
import { User, UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { toast } from "sonner";

type FetchDataResponse = {
  data: Twin[];
  pageCount: number;
};

const columns: ColumnDef<Twin>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinResourceLink data={original} withTooltip />
      </div>
    ),
  },
  {
    accessorKey: "twinClassId",
    header: "Twin Class",
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
  {
    accessorKey: "statusId",
    header: "Status",
    cell: ({ row: { original } }) =>
      original.status && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.status as TwinClassStatus}
            twinClassId={original.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "authorUserId",
    header: "Author",
    cell: ({ row: { original } }) =>
      original.authorUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.authorUser as User} withTooltip />
        </div>
      ),
  },
  {
    accessorKey: "assignerUserId",
    header: "Assigner",
    cell: ({ row: { original } }) =>
      original.assignerUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.assignerUser as User} withTooltip />
        </div>
      ),
  },
  {
    accessorKey: "headTwinId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headTwinId ? (
        <div className="max-w-48 inline-flex">
          <TwinResourceLink data={{ id: original.headTwinId }} withTooltip />
        </div>
      ) : null,
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
  {
    accessorKey: "markers",
    header: "Markers",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt
        ? new Date(original.createdAt).toLocaleDateString()
        : "",
  },
];

export default function TwinsPage() {
  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useTwinFilters();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Twins", href: "/twin" }]);
  }, []);

  async function fetchTwin({
    search,
    pagination,
    filters,
  }: {
    search?: string;
    pagination?: PaginationState;
    filters: FiltersState;
  }): Promise<FetchDataResponse> {
    const _pagination = pagination || { pageIndex: 0, pageSize: 10 };
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const { data, error } = await api.twin.search({
        pagination: _pagination,
        search: search,
        filters: _filters,
      });

      if (error) {
        console.error("failed to fetch twins", error);
        toast.error("Failed to fetch twins");
        return {
          data: [],
          pageCount: 0,
        };
      }

      return {
        data:
          data?.twinList?.map((dto) =>
            hydrateTwinFromMap(dto, data.relatedObjects)
          ) ?? [],
        pageCount: Math.ceil(
          (data.pagination?.total ?? 0) / _pagination.pageSize
        ),
      };
    } catch (e) {
      console.error("Exception when fetching twins", e);
      toast.error("Failed to fetch twins");
      return {
        data: [],
        pageCount: 0,
      };
    }
  }

  return (
    <CrudDataTable
      ref={tableRef}
      columns={columns}
      getRowId={(row) => row.id!}
      fetcher={(pagination, filters) => fetchTwin({ pagination, filters })}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) => router.push(`/twin/${row.id}`)}
      createButton={{
        enabled: false,
        text: "Create",
      }}
      filters={{
        filtersInfo: buildFilterFields(),
        onChange: () => {
          console.log("Filters changed");
          return Promise.resolve();
        },
      }}
      customizableColumns={{
        enabled: true,
        defaultVisibleKeys: [
          "id",
          "twinClassId",
          "statusId",
          "name",
          "description",
          "authorUserId",
          "assignerUserId",
          "headTwinId",
          "createdAt",
        ],
      }}
    />
  );
}
