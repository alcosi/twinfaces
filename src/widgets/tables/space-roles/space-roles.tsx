"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SpaceRole_DETAILED, useSpaceRoleSearch } from "@/entities/space-role";
import { useSpaceRoleFilters } from "@/entities/space-role/libs";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  "id" | "key" | "twinClass" | "businessAccountId" | "name" | "description",
  ColumnDef<SpaceRole_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  key: {
    id: "key",
    accessorKey: "key",
    header: "Key",
    cell: (data) => data.getValue<string>(),
  },
  twinClass: {
    id: "twinClass",
    accessorKey: "twinClass",
    header: "Twin class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },
  businessAccountId: {
    id: "businessAccountId",
    accessorKey: "businessAccountId",
    header: "Business account",
    cell: ({ row: { original } }) =>
      original.businessAccount && (
        <div className="inline-flex max-w-48">
          <BusinessAccountResourceLink
            data={original.businessAccount}
            withTooltip
          />
        </div>
      ),
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: (data) => data.getValue<string>(),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: (data) => data.getValue<string>(),
  },
};

export function SpaceRolesTable({ title }: { title?: string }) {
  const { searchSpaceRole } = useSpaceRoleSearch();
  const { buildFilterFields, mapFiltersToPayload } = useSpaceRoleFilters();
  const router = useRouter();

  async function fetchSpaceRoles(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<SpaceRole_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchSpaceRole({ pagination, filters: { ..._filters } });
    } catch (error) {
      toast.error("An error occured while fetching space roles: " + error);
      throw new Error("An error occured while fetching space roles: " + error);
    }
  }

  return (
    <CrudDataTable
      title={title ?? "Space roles"}
      columns={[
        colDefs.id,
        colDefs.key,
        colDefs.twinClass,
        colDefs.businessAccountId,
        colDefs.name,
        colDefs.description,
      ]}
      fetcher={fetchSpaceRoles}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.twinClass,
        colDefs.businessAccountId,
        colDefs.name,
        colDefs.description,
      ]}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/space-roles/${row.id}`)
      }
    />
  );
}
