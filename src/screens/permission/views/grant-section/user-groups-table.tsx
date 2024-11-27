import { PermissionSchemaResourceLink } from "@/entities/permissionSchema";
import { UserResourceLink } from "@/entities/user";
import {
  PermissionGrantUserGroup,
  PermissionGrantUserGroup_DETAILED,
  usePermissionGrantUserGroupSearchV1,
  UserGroupResourceLink,
} from "@/entities/userGroup";
import { PermissionContext } from "@/features/permission";
import { PagedResponse } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Pick<
    PermissionGrantUserGroup,
    "id" | "permissionSchemaId" | "userGroupId" | "grantedByUserId"
  >,
  ColumnDef<PermissionGrantUserGroup>
> = {
  id: {
    accessorKey: "id",
    header: "Id",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
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
  userGroupId: {
    accessorKey: "userGroupId",
    header: "User Group",
    cell: ({ row: { original } }) =>
      original.userGroup && (
        <div className="max-w-48 inline-flex">
          <UserGroupResourceLink data={original.userGroup} withTooltip />
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

export function UserGroupsTable() {
  const { permission } = useContext(PermissionContext);
  const { searchPermissionGrantUserGroups } =
    usePermissionGrantUserGroupSearchV1();

  async function fetchData(
    pagination: PaginationState
    // filters: FiltersState
  ): Promise<PagedResponse<PermissionGrantUserGroup_DETAILED>> {
    try {
      const response = await searchPermissionGrantUserGroups({
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
      title="User groups"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.userGroupId,
        colDefs.grantedByUserId,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[]}
    />
  );
}
