import { GuidWithCopy } from "@/shared/ui/guid";
import { UserResourceLink } from "@/entities/user";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { TwinClassResourceLink } from "@/entities/twinClass";
import {
  PermissionGrantTwinRoles_DETAILED,
  usePermissionGrantTwinRolesSearchV1,
} from "@/entities/twinRole";
import { PermissionSchemaResourceLink } from "@/entities/permissionSchema";

const colDefs: Record<
  keyof Pick<
    PermissionGrantTwinRoles_DETAILED,
    | "id"
    | "permissionSchemaId"
    | "twinClassId"
    | "twinRole"
    | "grantedByUserId"
    | "grantedAt"
  >,
  ColumnDef<PermissionGrantTwinRoles_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "Id",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  permissionSchemaId: {
    id: "permissionSchemaId",
    accessorKey: "permissionSchemaId",
    header: "Persmission Schema",
    cell: ({ row: { original } }) =>
      original.permissionSchema && (
        <div className="max-w-48 inline-flex">
          <PermissionSchemaResourceLink data={original.permissionSchema} />
        </div>
      ),
  },
  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },
  twinRole: {
    id: "twinRole",
    accessorKey: "twinRole",
    header: "Twin role",
  },
  grantedByUserId: {
    id: "grantedByUserId",
    accessorKey: "grantedByUserId",
    header: "Granted by",
    cell: ({ row: { original } }) =>
      original.grantedByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.grantedByUser} withTooltip />
        </div>
      ),
  },
  grantedAt: {
    id: "grantedAt",
    accessorKey: "grantedAt",
    header: "Granted at",
    cell: ({ row: { original } }) =>
      original.grantedAt && formatToTwinfaceDate(original.grantedAt),
  },
};

export function TwinRoleTable() {
  const { searchTwinRoleGrant } = usePermissionGrantTwinRolesSearchV1();

  async function fetchData(
    pagination: PaginationState
  ): Promise<PagedResponse<PermissionGrantTwinRoles_DETAILED>> {
    try {
      const response = await searchTwinRoleGrant({
        pagination,
        filters: {},
      });
      return response;
    } catch (e) {
      toast.error("Failed to fetch permissions twin roles");
      return { data: [], pagination: {} };
    }
  }

  return (
    <Experimental_CrudDataTable
      title="Twin roles"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.twinClassId,
        colDefs.twinRole,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[]}
    />
  );
}
