import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TwinClassContext } from "@/entities/twin-class";
import {
  TWIN_FLOW_SCHEMA,
  TwinFlow,
  TwinFlowCreateRq,
  TwinFlowResourceLink,
  TwinFlow_DETAILED,
  useCreateTwinFlow,
  useTwinFlowFilters,
  useTwinFlowSearchV1,
} from "@/entities/twin-flow";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { UserResourceLink } from "@/entities/user";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { PlatformArea } from "@/shared/config";
import { reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

import { TwinClassTwinFlowFormFields } from "./form-fields";

const columnsMap: Record<
  Extract<
    keyof TwinFlow,
    | "id"
    | "name"
    | "description"
    | "initialStatusId"
    | "createdByUserId"
    | "createdAt"
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
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatToTwinfaceDate(original.createdAt, "datetime"),
  },
};

export function TwinClassTwinFlows() {
  const { twinClassId } = useContext(TwinClassContext);
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const { createTwinFlow } = useCreateTwinFlow();
  const { buildFilterFields, mapFiltersToPayload } = useTwinFlowFilters();
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  const dialogForm = useForm<z.infer<typeof TWIN_FLOW_SCHEMA>>({
    resolver: zodResolver(TWIN_FLOW_SCHEMA),
    defaultValues: {
      twinClassId: twinClassId || "",
      name: "",
      description: "",
      initialStatus: "",
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

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof TWIN_FLOW_SCHEMA>
  ) => {
    const { name, description, initialStatus } = formValues;

    const requestBody: TwinFlowCreateRq = {
      nameI18n: { translationInCurrentLocale: name, translations: {} },
      descriptionI18n: {
        translationInCurrentLocale: description,
        translations: {},
      },
      initialStatusId: initialStatus,
    };

    await createTwinFlow({
      twinClassId: twinClassId,
      body: requestBody,
    });
    toast.success("Twin flow created successfully!");
  };

  return (
    <CrudDataTable
      ref={tableRef}
      columns={[
        columnsMap.id,
        columnsMap.name,
        columnsMap.description,
        columnsMap.initialStatusId,
        columnsMap.createdByUserId,
        columnsMap.createdAt,
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
      defaultVisibleColumns={[
        columnsMap.id,
        columnsMap.name,
        columnsMap.description,
        columnsMap.initialStatusId,
        columnsMap.createdByUserId,
        columnsMap.createdAt,
      ]}
      dialogForm={dialogForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinClassTwinFlowFormFields control={dialogForm.control} />
      )}
    />
  );
}
