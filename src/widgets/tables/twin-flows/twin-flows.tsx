import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import {
  TWIN_FLOW_SCHEMA,
  TwinFlow,
  TwinFlowCreateRq,
  TwinFlow_DETAILED,
  useCreateTwinFlow,
  useTwinFlowFilters,
  useTwinFlowSearchV1,
} from "@/entities/twin-flow";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  formatIntlDate,
  isFalsy,
  isTruthy,
  reduceToObject,
  toArray,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TwinClassTwinFlowFormFields } from "./form-fields";

const columnsMap: Record<
  Extract<
    keyof TwinFlow,
    | "id"
    | "twinClassId"
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
  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  name: {
    accessorKey: "name",
    header: "Name",
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
        <div className="inline-flex max-w-48">
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
        <div className="inline-flex max-w-48">
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
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function TwinFlows({ twinClassId }: { twinClassId?: string }) {
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const { createTwinFlow } = useCreateTwinFlow();
  const { buildFilterFields, mapFiltersToPayload } = useTwinFlowFilters({
    twinClassId,
    enabledFilters: isTruthy(twinClassId)
      ? [
          "idList",
          "nameI18nLikeList",
          "descriptionI18nLikeList",
          "initialStatusIdList",
          "createdByUserIdList",
        ]
      : undefined,
  });
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

  const handleCreateSubmit = async (
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
      twinClassId: twinClassId || formValues.twinClassId!,
      body: requestBody,
    });
    toast.success("Twin flow created successfully!");
  };

  return (
    <CrudDataTable
      ref={tableRef}
      columns={[
        columnsMap.id,
        ...(isFalsy(twinClassId) ? [columnsMap.twinClassId] : []),
        columnsMap.name,
        columnsMap.description,
        columnsMap.initialStatusId,
        columnsMap.createdByUserId,
        columnsMap.createdAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchTwinflows}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/twinflows/${row.id}`)
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        columnsMap.id,
        ...(isFalsy(twinClassId) ? [columnsMap.twinClassId] : []),
        columnsMap.name,
        columnsMap.description,
        columnsMap.initialStatusId,
        columnsMap.createdByUserId,
        columnsMap.createdAt,
      ]}
      dialogForm={dialogForm}
      onCreateSubmit={handleCreateSubmit}
      renderFormFields={() => (
        <TwinClassTwinFlowFormFields control={dialogForm.control} />
      )}
    />
  );
}
