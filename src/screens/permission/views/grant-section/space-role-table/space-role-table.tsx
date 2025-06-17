import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PERMISSION_GRANT_SPACE_ROLE_SCHEMA,
  useCreatePermissionGrantSpaceRole,
} from "@/entities/permission";
import {
  PermissionGrantSpaceRole_DETAILED,
  usePermissionSpaceRoleSearchV1,
} from "@/entities/space-role";
import { PermissionContext } from "@/features/permission";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { SpaceRoleResourceLink } from "@/features/space-role/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";

import { SpaceRoleTableFormFields } from "./form-fields";

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
        <div className="inline-flex max-w-48">
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
        <div className="inline-flex max-w-48">
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
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.grantedByUser} withTooltip />
        </div>
      ),
  },

  grantedAt: {
    id: "grantedAt",
    accessorKey: "grantedAt",
    header: "Granted at",
    cell: ({ row: { original } }) =>
      original.grantedAt &&
      formatIntlDate(original.grantedAt, "datetime-local"),
  },
};

export function SpaceRoleTable() {
  const { permission, permissionId } = useContext(PermissionContext);
  const { searchSpaceRoleGrant } = usePermissionSpaceRoleSearchV1();
  const { createPermissionGrantSpaceRole } =
    useCreatePermissionGrantSpaceRole();

  const spaceRoleForm = useForm<
    z.infer<typeof PERMISSION_GRANT_SPACE_ROLE_SCHEMA>
  >({
    resolver: zodResolver(PERMISSION_GRANT_SPACE_ROLE_SCHEMA),
    defaultValues: {
      permissionId: permissionId || "",
      permissionSchemaId: "",
      spaceRoleId: "",
    },
  });

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

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PERMISSION_GRANT_SPACE_ROLE_SCHEMA>
  ) => {
    const { ...body } = formValues;

    await createPermissionGrantSpaceRole({
      body: { permissionGrantSpaceRole: body },
    });
    toast.success("Space role permission is granted successfully!");
  };

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
      dialogForm={spaceRoleForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <SpaceRoleTableFormFields control={spaceRoleForm.control} />
      )}
    />
  );
}
