import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PERMISSION_GRANT_TWIN_ROLE_SCHEMA,
  useCreatePermissionGrantTwinRole,
} from "@/entities/permission";
import {
  PermissionGrantTwinRoles_DETAILED,
  TwinRoleEnum,
  usePermissionGrantTwinRolesSearchV1,
} from "@/entities/twin-role";
import { PermissionContext } from "@/features/permission";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";

import { TwinRoleTableFormFields } from "./form-fields";

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
        <div className="inline-flex max-w-48">
          <PermissionSchemaResourceLink
            data={original.permissionSchema}
            withTooltip
          />
        </div>
      ),
  },

  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
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

export function TwinRoleTable() {
  const { permission, permissionId } = useContext(PermissionContext);
  const { searchTwinRoleGrant } = usePermissionGrantTwinRolesSearchV1();
  const { createPermissionGrantTwinRole } = useCreatePermissionGrantTwinRole();

  const twinRoleForm = useForm<
    z.infer<typeof PERMISSION_GRANT_TWIN_ROLE_SCHEMA>
  >({
    resolver: zodResolver(PERMISSION_GRANT_TWIN_ROLE_SCHEMA),
    defaultValues: {
      permissionId: permissionId || "",
      permissionSchemaId: "",
      twinClassId: "",
      twinRole: TwinRoleEnum.assignee,
    },
  });

  async function fetchData(
    pagination: PaginationState
  ): Promise<PagedResponse<PermissionGrantTwinRoles_DETAILED>> {
    try {
      const response = await searchTwinRoleGrant({
        pagination,
        filters: {
          permissionIdList: permission ? [permission.id] : [],
        },
      });
      return response;
    } catch (e) {
      toast.error("Failed to fetch permissions twin roles");
      return { data: [], pagination: {} };
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PERMISSION_GRANT_TWIN_ROLE_SCHEMA>
  ) => {
    const { ...body } = formValues;

    await createPermissionGrantTwinRole({
      body: { permissionGrantTwinRole: body },
    });
    toast.success("Twin role permission is granted successfully!");
  };

  return (
    <CrudDataTable
      title="For twin role"
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
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.twinClassId,
        colDefs.twinRole,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      dialogForm={twinRoleForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinRoleTableFormFields control={twinRoleForm.control} />
      )}
    />
  );
}
