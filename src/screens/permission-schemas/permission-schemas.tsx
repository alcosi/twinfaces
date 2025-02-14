import {
  PermissionSchema,
  usePermissionSchemaFilters,
  usePermissionSchemaSearchV1,
} from "@/entities/permission-schema";
import { UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Pick<
    PermissionSchema,
    | "id"
    | "name"
    | "description"
    | "createdByUserId"
    | "domainId"
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

  domainId: {
    id: "domainId",
    accessorKey: "domainId",
    header: "Domain",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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
      { label: "Permission Schemas", href: "/workspace/permission-schemas" },
    ]);
  }, []);

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
      toast.error("Failed to fetch permissions schema");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      title="Permission Schemas"
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.createdByUserId,
        colDefs.domainId,
        colDefs.businessAccountId,
        colDefs.createdAt,
      ]}
      fetcher={fetchPermissionSchemas}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/workspace/permission-schemas/${row.id}`)
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
        colDefs.domainId,
        colDefs.businessAccountId,
        colDefs.createdAt,
      ]}
    />
  );
}
