import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  PermissionSchema,
  usePermissionSchemaFilters,
  usePermissionSchemaSearchV1,
} from "@/entities/permission-schema";
import { UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
    PermissionSchema,
    | "id"
    | "name"
    | "description"
    | "createdByUserId"
    | "businessAccountId"
    | "createdAt"
  >,
  ColumnDef<PermissionSchema>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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

  createdByUserId: {
    id: "createdByUserId",
    accessorKey: "createdByUserId",
    header: "Created By",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },

  businessAccountId: {
    id: "businessAccountId",
    accessorKey: "businessAccountId",
    header: "Business Account",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function PermissionSchemasScreen() {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchPermissionSchemas } = usePermissionSchemaSearchV1();
  const { buildFilterFields, mapFiltersToPayload } =
    usePermissionSchemaFilters();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Schemas", href: `/${PlatformArea.core}/permission-schemas` },
    ]);
  }, [setBreadcrumbs]);

  async function fetchPermissionSchemas(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<PermissionSchema>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchPermissionSchemas({
        pagination,
        filters: _filters,
      });
      return response;
    } catch (e) {
      toast.error("Failed to fetch permission schemas");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      title="Permission Schemas"
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.createdByUserId,
        colDefs.businessAccountId,
        colDefs.createdAt,
      ]}
      fetcher={fetchPermissionSchemas}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/permission-schemas/${row.id}`)
      }
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.createdByUserId,
        colDefs.businessAccountId,
        colDefs.createdAt,
      ]}
    />
  );
}
