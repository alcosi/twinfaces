"use client";

import {
  Twin,
  TwinResourceLink,
  useTwinFilters,
  useTwinSearchV3,
} from "@/entities/twin";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { TwinClassStatusResourceLink, TwinStatus } from "@/entities/twinStatus";
import { User, UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { FiltersState } from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { formatToTwinfaceDate } from "@/shared/libs";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
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
  >,
  ColumnDef<Twin>
> = {
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

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinResourceLink data={original} withTooltip />
      </div>
    ),
  },

  statusId: {
    id: "statusId",
    accessorKey: "statusId",
    header: "Status",
    cell: ({ row: { original } }) =>
      original.status && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.status as TwinStatus}
            twinClassId={original.twinClassId!}
            withTooltip
          />
        </div>
      ),
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
  },

  markers: {
    id: "markers",
    accessorKey: "markers",
    header: "Markers",
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export default function TwinsPage() {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useTwinFilters();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchTwins } = useTwinSearchV3();

  useEffect(() => {
    setBreadcrumbs([{ label: "Twins", href: "/workspace/twin" }]);
  }, []);

  async function fetchTwin({
    search,
    pagination,
    filters,
  }: {
    search?: string;
    pagination?: PaginationState;
    filters: FiltersState;
  }): Promise<PagedResponse<Twin>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwins({
        search: search,
        pagination: pagination,
        filters: _filters,
      });
    } catch (e) {
      console.error("Failed to fetch twins", e);
      toast.error("Failed to fetch twins");
      return { data: [], pagination: {} };
    }
  }

  return (
    <Experimental_CrudDataTable
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.twinClassId,
        colDefs.name,
        colDefs.statusId,
        colDefs.description,
        colDefs.authorUserId,
        colDefs.assignerUserId,
        colDefs.headTwinId,
        colDefs.tags,
        colDefs.markers,
        colDefs.createdAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={(pagination, filters) => fetchTwin({ pagination, filters })}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) => router.push(`/workspace/twin/${row.id}`)}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinClassId,
        colDefs.name,
        colDefs.statusId,
        colDefs.description,
        colDefs.authorUserId,
        colDefs.assignerUserId,
        colDefs.headTwinId,
        colDefs.tags,
        colDefs.markers,
        colDefs.createdAt,
      ]}
    />
  );
}
