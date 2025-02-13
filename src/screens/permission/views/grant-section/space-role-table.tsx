import { PermissionSchemaResourceLink } from "@/entities/permissionSchema";
import {
  PermissionGrantSpaceRole_DETAILED,
  SpaceRoleResourceLink,
  usePermissionSpaceRoleSearchV1,
} from "@/entities/spaceRole";
import { UserResourceLink } from "@/entities/user";
import { PermissionContext } from "@/features/permission";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Pick<
    PermissionGrantSpaceRole_DETAILED,
    | "id"
    | "permissionSchemaId"
    | "spaceRoleId"
    | "grantedByUserId"
    | "grantedAt"
  >,
  ColumnDef<PermissionGrantSpaceRole_DETAILED>
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

  spaceRoleId: {
    id: "spaceRoleId",
    accessorKey: "spaceRoleId",
    header: "Space role",
    cell: ({ row: { original } }) =>
      original.spaceRole && (
        <div className="max-w-48 inline-flex">
          <SpaceRoleResourceLink data={original.spaceRole} withTooltip />
        </div>
      ),
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

export function SpaceRoleTable() {
  const { permission } = useContext(PermissionContext);
  const { searchSpaceRoleGrant } = usePermissionSpaceRoleSearchV1();

  async function fetchData(
    pagination: PaginationState
  ): Promise<PagedResponse<PermissionGrantSpaceRole_DETAILED>> {
    try {
      const response = await searchSpaceRoleGrant({
        pagination,
        filters: {
          permissionIdList: permission ? [permission.id] : [],
        },
      });

      return response;
    } catch (e) {
      toast.error("Failed to fetch permissions space role");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      title="For space role"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.spaceRoleId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.spaceRoleId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
    />
  );
}
