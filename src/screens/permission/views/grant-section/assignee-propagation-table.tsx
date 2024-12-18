import { GuidWithCopy } from "@/shared/ui/guid";
import { UserResourceLink } from "@/entities/user";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { TwinClassResourceLink } from "@/entities/twinClass";
import { PermissionSchemaResourceLink } from "@/entities/permissionSchema";
import {
  PermissionGrantAssigneePropagation_DETAILED,
  usePermissionGrantAssigneePropagationSearchV1,
} from "@/entities/assigneePropagation";
import { TwinClassStatusResourceLink } from "@/entities/twinStatus";

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
          <PermissionSchemaResourceLink data={original.permissionSchema} />
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
  const { searchAssigneePropagationGrant } =
    usePermissionGrantAssigneePropagationSearchV1();

  async function fetchData(
    pagination: PaginationState
  ): Promise<PagedResponse<PermissionGrantAssigneePropagation_DETAILED>> {
    try {
      const response = await searchAssigneePropagationGrant({
        pagination,
        filters: {},
      });
      return response;
    } catch (e) {
      toast.error("Failed to fetch permissions assignee propagation");
      return { data: [], pagination: {} };
    }
  }

  return (
    <Experimental_CrudDataTable
      title="Assignee propagation"
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
      defaultVisibleColumns={[]}
    />
  );
}
