"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  PermissionGroup,
  PermissionGroup_DETAILED,
  usePermissionGroupFilters,
  usePermissionGroupSearchV1,
} from "@/entities/permission-group";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { PermissionGroupResourceLink } from "@/features/permission-group/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui/guid";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Omit<PermissionGroup, "twinClass">,
  ColumnDef<PermissionGroup>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "Id",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  key: {
    id: "key",
    accessorKey: "key",
    header: "Key",
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="inline-flex max-w-48">
        <PermissionGroupResourceLink data={original} withTooltip />
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
  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Twin Class",
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
};

export function PermissionGroupsTable() {
  const { searchPermissionGroups } = usePermissionGroupSearchV1();
  const { buildFilterFields, mapFiltersToPayload } =
    usePermissionGroupFilters();

  async function fetchData(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<PermissionGroup_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchPermissionGroups({
        pagination,
        filters: _filters,
      });

      return response;
    } catch (e) {
      console.error("Failed to fetch permission groups", e);
      toast.error("Failed to fetch permissions");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id!,
        colDefs.key!,
        colDefs.name!,
        colDefs.description!,
        colDefs.twinClassId,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[colDefs.id, colDefs.name, colDefs.twinClassId]}
      orderedColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.twinClassId,
      ]}
      groupableColumns={[colDefs.id, colDefs.name, colDefs.twinClassId]}
    />
  );
}
