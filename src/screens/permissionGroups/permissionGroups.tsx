"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  PermissionGroup,
  PermissionGroupResourceLink,
  PermissionGroup_DETAILED,
  usePermissionGroupFilters,
  usePermissionGroupSearchV1,
} from "@/entities/permission-group";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui/guid";
import { FiltersState } from "@/widgets/crud-data-table";
import { CrudDataTable } from "@/widgets/crud-data-table";

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
      <div className="max-w-48 inline-flex">
        <PermissionGroupResourceLink data={original} withTooltip />
      </div>
    ),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  twinClassId: {
    id: "twinClassId",
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
};

export function PermissionGroups() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchPermissionGroups } = usePermissionGroupSearchV1();
  const { buildFilterFields, mapFiltersToPayload } =
    usePermissionGroupFilters();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Permission Groups",
        href: `/${PlatformArea.core}/permission-groups`,
      },
    ]);
  }, []);

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
      defaultVisibleColumns={[
        colDefs.id,
        // colDefs.key,
        colDefs.name,
        // colDefs.description,
        colDefs.twinClassId,
      ]}
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
