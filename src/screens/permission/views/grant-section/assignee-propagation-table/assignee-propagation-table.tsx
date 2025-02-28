import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { toast } from "sonner";

import {
  PermissionGrantAssigneePropagation_DETAILED,
  usePermissionGrantAssigneePropagationSearchV1,
} from "@/entities/assigneePropagation";
import { PermissionSchemaResourceLink } from "@/entities/permission-schema";
import { TwinClassResourceLink } from "@/entities/twin-class";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { UserResourceLink } from "@/entities/user";
import { PermissionContext } from "@/features/permission";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";

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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
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

export function AssigneePropagationTable() {
  const { permission } = useContext(PermissionContext);
  const { searchAssigneePropagationGrant } =
    usePermissionGrantAssigneePropagationSearchV1();

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
    />
  );
}
