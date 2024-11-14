"use client";

import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import {
  buildFilterFields,
  mapToPermissionGroupApiFilters,
  PermissionGroup,
  PermissionGroup_DETAILED,
  usePermissionGroupSearchV1,
} from "@/entities/permissionGroup";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { mergeUniqueItems } from "@/shared/libs";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Omit<PermissionGroup, "twinClass">,
  ColumnDef<PermissionGroup>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "Id",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
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
  const [permissionGroups, setPermissionGroups] = useState<
    PermissionGroup_DETAILED[]
  >([]);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchPermissionGroups } = usePermissionGroupSearchV1();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Permission Groups", href: "/permission-groups" },
    ]);
  }, []);

  async function fetchData(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<{ data: PermissionGroup_DETAILED[]; pageCount: number }> {
    const _filters = mapToPermissionGroupApiFilters(filters.filters);

    try {
      const response = await searchPermissionGroups({
        pagination,
        filters: _filters,
      });

      const permissionGroups = response.data ?? [];
      setPermissionGroups((prev) => mergeUniqueItems(prev, permissionGroups));

      return { data: permissionGroups, pageCount: 0 };
    } catch (e) {
      console.error("Failed to fetch permission groups", e);
      toast.error("Failed to fetch permissions");
      return { data: [], pageCount: 0 };
    }
  }

  return (
    <Experimental_CrudDataTable
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
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
        filtersInfo: buildFilterFields(permissionGroups),
        onChange: () => Promise.resolve(),
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
