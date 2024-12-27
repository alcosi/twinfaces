import { GuidWithCopy } from "@/shared/ui/guid";
import { PermissionSchemaResourceLink } from "@/entities/permissionSchema";
import {
  PermissionGrantUser,
  PermissionGrantUser_DETAILED,
  usePermissionGrantUserSearchV1,
  UserResourceLink,
} from "@/entities/user";
import { PermissionContext } from "@/features/permission";
import { PagedResponse } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Pick<
    PermissionGrantUser,
    "id" | "permissionSchemaId" | "userId" | "grantedByUserId"
  >,
  ColumnDef<PermissionGrantUser>
> = {
  id: {
    accessorKey: "id",
    header: "Id",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  permissionSchemaId: {
    accessorKey: "permissionSchemaId",
    header: "Persmission Schema",
    cell: ({ row: { original } }) =>
      original.permissionSchema && (
        <div className="max-w-48 inline-flex">
          <PermissionSchemaResourceLink data={original.permissionSchema} />
        </div>
      ),
  },
  userId: {
    accessorKey: "userId",
    header: "User",
    cell: ({ row: { original } }) =>
      original.user && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.user} withTooltip />
        </div>
      ),
  },
  grantedByUserId: {
    accessorKey: "grantedByUserId",
    header: "Granted by",
    cell: ({ row: { original } }) =>
      original.grantedByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.grantedByUser} withTooltip />
        </div>
      ),
  },
};

export function UsersTable() {
  const { permission } = useContext(PermissionContext);
  const { searchPermissionGrantUsers } = usePermissionGrantUserSearchV1();

  async function fetchData(
    pagination: PaginationState
    // filters: FiltersState
  ): Promise<PagedResponse<PermissionGrantUser_DETAILED>> {
    try {
      const response = await searchPermissionGrantUsers({
        pagination,
        filters: {
          permissionIdList: permission ? [permission.id] : [],
        },
      });

      return response;
    } catch (e) {
      console.error("Failed to fetch permission groups", e);
      toast.error("Failed to fetch permissions");
      return { data: [], pagination: {} };
    }
  }

  if (isUndefined(permission)) return null;

  return (
    <Experimental_CrudDataTable
      title="Users"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.userId,
        colDefs.grantedByUserId,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[]}
    />
  );
}
