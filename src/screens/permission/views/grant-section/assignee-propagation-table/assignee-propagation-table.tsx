import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  PermissionGrantAssigneePropagation_DETAILED,
  usePermissionGrantAssigneePropagationSearchV1,
} from "@/entities/assigneePropagation";
import {
  PERMISSION_GRANT_ASSIGNEE_PROPAGATION_SCHEMA,
  useCreatePermissionGrantAssigneePropagation,
} from "@/entities/permission";
import { PermissionContext } from "@/features/permission";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";

import { AssigneePropagationFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    PermissionGrantAssigneePropagation_DETAILED,
    | "id"
    | "permissionSchemaId"
    | "propagationTwinClassId"
    | "propagationTwinStatusId"
    | "grantedByUserId"
    | "grantedAt"
  >,
  ColumnDef<PermissionGrantAssigneePropagation_DETAILED>
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

  propagationTwinClassId: {
    id: "propagationTwinClassId",
    accessorKey: "propagationTwinClassId",
    header: "By class",
    cell: ({ row: { original } }) =>
      original.propagationTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.propagationTwinClass}
            withTooltip
          />
        </div>
      ),
  },

  propagationTwinStatusId: {
    id: "propagationTwinStatusId",
    accessorKey: "propagationTwinStatusId",
    header: "By status",
    cell: ({ row: { original } }) =>
      original.propagationTwinStatus && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink
            data={original.propagationTwinStatus}
            twinClassId={original.propagationTwinStatusId!}
            withTooltip
          />
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

export function AssigneePropagationTable() {
  const { permission, permissionId } = useContext(PermissionContext);
  const { searchAssigneePropagationGrant } =
    usePermissionGrantAssigneePropagationSearchV1();
  const { createPermissionGrantAssigneePropagation } =
    useCreatePermissionGrantAssigneePropagation();

  const assigneePropagationForm = useForm<
    z.infer<typeof PERMISSION_GRANT_ASSIGNEE_PROPAGATION_SCHEMA>
  >({
    resolver: zodResolver(PERMISSION_GRANT_ASSIGNEE_PROPAGATION_SCHEMA),
    defaultValues: {
      permissionId: permissionId || "",
      permissionSchemaId: "",
      propagationByTwinClassId: "",
      propagationByTwinStatusId: "",
      inSpaceOnly: false,
    },
  });

  async function fetchData(
    pagination: PaginationState
  ): Promise<PagedResponse<PermissionGrantAssigneePropagation_DETAILED>> {
    try {
      const response = await searchAssigneePropagationGrant({
        pagination,
        filters: {
          permissionIdList: permission ? [permission.id] : [],
        },
      });
      return response;
    } catch (e) {
      toast.error("Failed to fetch permissions assignee propagation");
      return { data: [], pagination: {} };
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PERMISSION_GRANT_ASSIGNEE_PROPAGATION_SCHEMA>
  ) => {
    const { ...body } = formValues;

    await createPermissionGrantAssigneePropagation({
      body: { permissionGrantAssigneePropagation: body },
    });
    toast.success("Assignee propagation permission is granted successfully!");
  };

  return (
    <CrudDataTable
      title="By assignee propagation"
      columns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.propagationTwinClassId,
        colDefs.propagationTwinStatusId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      fetcher={fetchData}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.permissionSchemaId,
        colDefs.propagationTwinClassId,
        colDefs.propagationTwinStatusId,
        colDefs.grantedByUserId,
        colDefs.grantedAt,
      ]}
      dialogForm={assigneePropagationForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <AssigneePropagationFormFields
          control={assigneePropagationForm.control}
        />
      )}
    />
  );
}
