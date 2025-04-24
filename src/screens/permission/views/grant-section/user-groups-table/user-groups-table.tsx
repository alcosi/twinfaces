import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PERMISSION_GRANT_USER_GROUP_SCHEMA,
  useCreatePermissionGrantUserGroup,
} from "@/entities/permission";
import {
  PermissionGrantUserGroup,
  PermissionGrantUserGroup_DETAILED,
  usePermissionGrantUserGroupSearchV1,
} from "@/entities/user-group";
import { PermissionContext } from "@/features/permission";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { UserGroupResourceLink } from "@/features/user-group/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate, isUndefined } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";

import { UserGroupTableFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    PermissionGrantUserGroup,
    | "id"
    | "permissionSchemaId"
    | "userGroupId"
    | "grantedByUserId"
    | "grantedAt"
  >,
  ColumnDef<PermissionGrantUserGroup>
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

  userGroupId: {
    id: "userGroupId",
    accessorKey: "userGroupId",
    header: "User Group",
    cell: ({ row: { original } }) =>
      original.userGroup && (
        <div className="inline-flex max-w-48">
          <UserGroupResourceLink data={original.userGroup} withTooltip />
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

export function UserGroupsTable() {
  const { permission, permissionId } = useContext(PermissionContext);
  const { searchPermissionGrantUserGroups } =
    usePermissionGrantUserGroupSearchV1();
  const { createPermissionGrantUserGroup } =
    useCreatePermissionGrantUserGroup();

  const userGroupForm = useForm<
    z.infer<typeof PERMISSION_GRANT_USER_GROUP_SCHEMA>
  >({
    resolver: zodResolver(PERMISSION_GRANT_USER_GROUP_SCHEMA),
    defaultValues: {
      permissionSchemaId: "",
      permissionId: permissionId || "",
      userGroupId: "",
    },
  });

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

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PERMISSION_GRANT_USER_GROUP_SCHEMA>
  ) => {
    const { ...body } = formValues;

    await createPermissionGrantUserGroup({
      body: { permissionGrantUserGroup: body },
    });
    toast.success("User group created successfully!");
  };

  return (
    <CrudDataTable
      title="For user group"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.userGroupId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.userGroupId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      dialogForm={userGroupForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <UserGroupTableFormFields control={userGroupForm.control} />
      )}
    />
  );
}
