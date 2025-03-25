import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TwinClassContext } from "@/entities/twin-class";
import {
  TwinFlow,
  TwinFlowResourceLink,
  TwinFlow_DETAILED,
  useTwinFlowFilters,
  useTwinFlowSearchV1,
} from "@/entities/twin-flow";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { UserResourceLink } from "@/entities/user";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

import { TwinClassTwinFlowFormFields } from "./form-fields";

const formSchema = z.object({
  name: z.string().min(1, "Name can not be empty"),
  description: z.string(),
  initialStatus: z.string().uuid("Status ID must be a valid UUID"),
});

const columnsMap: Record<
  Extract<
    keyof TwinFlow,
    "id" | "name" | "description" | "initialStatusId" | "createdByUserId"
  >,
  ColumnDef<TwinFlow_DETAILED>
> = {
  id: {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.row.original.id} />,
  },
  name: {
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinFlowResourceLink data={original} withTooltip />
      </div>
    ),
  },
  description: {
    accessorKey: "description",
    header: "Description",
  },
  initialStatusId: {
    accessorKey: "initialStatus",
    header: "Initial status",
    cell: ({ row: { original } }) =>
      original.initialStatus && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.initialStatus}
            twinClassId={original.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },
  createdByUserId: {
    accessorKey: "createdByUserId",
    header: "Created by",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
};

export function TwinClassTwinFlows() {
  const { twinClassId } = useContext(TwinClassContext);
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useTwinFlowFilters();
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  const dialogForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  async function fetchTwinflows(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinFlow_DETAILED>> {
    try {
      const response = await searchTwinFlows({
        pagination,
        filters: {
          twinClassIdMap: reduceToObject({
            list: toArray(twinClassId),
            defaultValue: true,
          }),
          ...mapFiltersToPayload(filters.filters),
        },
      });

      return response;
    } catch (e) {
      toast.error("Failed to fetch twinflow");
      return { data: [], pagination: {} };
    }
  }

  // NOTE: https://alcosi.atlassian.net/browse/TWINFACES-190
  return (
    <CrudDataTable
      ref={tableRef}
      columns={[
        columnsMap.id,
        columnsMap.name,
        columnsMap.description,
        columnsMap.initialStatusId,
        columnsMap.createdByUserId,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchTwinflows}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) =>
        router.push(
          `/${PlatformArea.core}/twinclass/${row.twinClassId}/twinflow/${row.id}`
        )
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      dialogForm={dialogForm}
      onCreateSubmit={async () => undefined}
      renderFormFields={() => (
        <TwinClassTwinFlowFormFields
          control={dialogForm.control}
          twinClassId={twinClassId}
        />
      )}
    />
  );
}
