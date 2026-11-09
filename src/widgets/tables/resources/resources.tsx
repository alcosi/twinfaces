"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { ForwardedRef, useRef } from "react";
import { toast } from "sonner";

import {
  Resource,
  useResourceFilters,
  useResourceSearchV1,
} from "@/entities/resource";
import { PagedResponse, SortV1 } from "@/shared/api";
import { fixedForwardRef, formatIntlDate } from "@/shared/libs";
import { AnchorWithCopy } from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
} from "../../crud-data-table";

function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null) return "";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function resourceUrl(resourceId?: string): string | undefined {
  if (!resourceId) return undefined;
  return `/api/proxy/public/resource/${resourceId}/v1`;
}

const colDefs: Record<
  keyof Pick<
    Resource,
    "id" | "originalFileName" | "sizeInBytes" | "uploadedByUserId" | "createdAt"
  >,
  ColumnDef<Resource>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  originalFileName: {
    id: "originalFileName",
    accessorKey: "originalFileName",
    header: () => (
      <SortableHeader title="File name" sortField="originalFileName" />
    ),
    cell: ({ row: { original } }) => {
      const url = resourceUrl(original.id);
      if (!original.originalFileName) return null;
      if (!url) return original.originalFileName;

      return (
        <div className="max-w-64">
          <AnchorWithCopy
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate"
          >
            {original.originalFileName}
          </AnchorWithCopy>
        </div>
      );
    },
  },
  sizeInBytes: {
    id: "sizeInBytes",
    accessorKey: "sizeInBytes",
    header: () => <SortableHeader title="Size" sortField="sizeInBytes" />,
    cell: ({ row: { original } }) => formatBytes(original.sizeInBytes),
  },
  uploadedByUserId: {
    id: "uploadedByUserId",
    accessorKey: "uploadedByUserId",
    header: () => (
      <SortableHeader title="Uploaded by" sortField="uploadedByUserId" />
    ),
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: () => <SortableHeader title="Created at" sortField="createdAt" />,
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

const columns = [
  colDefs.id,
  colDefs.originalFileName,
  colDefs.sizeInBytes,
  colDefs.uploadedByUserId,
  colDefs.createdAt,
];

function ResourcesTableInternal(
  _props: object,
  ref: ForwardedRef<DataTableHandle>
) {
  const tableRef = useRef<DataTableHandle>(null);
  const { searchResources } = useResourceSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useResourceFilters();

  async function fetchResources(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Resource>> {
    try {
      return await searchResources({
        pagination,
        filters: mapFiltersToPayload(filters.filters),
        sort: sort ?? { field: "createdAt", direction: "DESC" },
      });
    } catch {
      toast.error("Failed to fetch resources");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      ref={ref ?? tableRef}
      permissionSegment="resource-upload"
      columns={columns}
      defaultVisibleColumns={columns}
      fetcher={fetchResources}
      getRowId={(row) => row.id!}
      disableRowClick
      filters={{
        filtersInfo: buildFilterFields(),
      }}
    />
  );
}

export const ResourcesTable = fixedForwardRef<DataTableHandle, object>(
  ResourcesTableInternal
);
