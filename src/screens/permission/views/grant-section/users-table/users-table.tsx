import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PERMISSION_GRANT_USER_SCHEMA,
  useCreatePermissionGrantUser,
} from "@/entities/permission";
import { PermissionSchemaResourceLink } from "@/entities/permission-schema";
import {
  PermissionGrantUser,
  PermissionGrantUser_DETAILED,
  UserResourceLink,
  usePermissionGrantUserSearchV1,
} from "@/entities/user";
import { PermissionContext } from "@/features/permission";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate, isUndefined } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";

import { UserTableFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    PermissionGrantUser,
    "id" | "permissionSchemaId" | "userId" | "grantedByUserId" | "grantedAt"
  >,
  ColumnDef<PermissionGrantUser>
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
          <PermissionSchemaResourceLink
            data={original.permissionSchema}
            withTooltip
          />
        </div>
      ),
  },

  userId: {
    id: "userId",
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

export function UsersTable() {
  const { permission, permissionId } = useContext(PermissionContext);
  const { searchPermissionGrantUsers } = usePermissionGrantUserSearchV1();
  const { createPermissionGrantUser } = useCreatePermissionGrantUser();

  const userForm = useForm<z.infer<typeof PERMISSION_GRANT_USER_SCHEMA>>({
    resolver: zodResolver(PERMISSION_GRANT_USER_SCHEMA),
    defaultValues: {
      permissionId: permissionId || "",
      permissionSchemaId: "",
      userId: "",
    },
  });

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

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PERMISSION_GRANT_USER_SCHEMA>
  ) => {
    const { ...body } = formValues;

    await createPermissionGrantUser({
      body: { permissionGrantUser: body },
    });
    toast.success("User created successfully!");
  };

  return (
    <CrudDataTable
      title="For user"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.userId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.userId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      dialogForm={userForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <UserTableFormFields control={userForm.control} />
      )}
    />
  );
}
