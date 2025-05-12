import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TwinFlow, TwinFlow_DETAILED } from "@/entities/twin-flow";
import {
  TWIN_FLOW_TRANSITION_SCHEMA,
  TwinFlowTransition,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionFormValues,
  TwinFlowTransition_DETAILED,
  useCreateTwinFlowTransition,
  useTwinFlowTransitionFilters,
  useTwinFlowTransitionSearchV1,
} from "@/entities/twin-flow-transition";
import { FactoryResourceLink } from "@/features/factory/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinFlowResourceLink } from "@/features/twin-flow/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  formatIntlDate,
  isFalsy,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { TwinFlowTransitionFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinFlowTransition,
    | "id"
    | "alias"
    | "name"
    | "description"
    | "srcTwinStatusId"
    | "dstTwinStatusId"
    | "permissionId"
    | "inbuiltTwinFactoryId"
    | "createdAt"
    | "twinflowId"
  >,
  ColumnDef<TwinFlowTransition_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  twinflowId: {
    id: "twinflowId",
    accessorKey: "twinflowId",
    header: "Twinflow",
    cell: ({ row: { original } }) =>
      original.twinflow && (
        <div className="inline-flex max-w-48">
          <TwinFlowResourceLink
            data={original.twinflow as TwinFlow_DETAILED}
            withTooltip
          />
        </div>
      ),
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },

  alias: {
    id: "alias",
    accessorKey: "alias",
    header: "Alias",
  },

  srcTwinStatusId: {
    id: "srcTwinStatusId",
    accessorKey: "srcTwinStatusId",
    header: "From",
    cell: ({ row: { original } }) =>
      original.srcTwinStatus && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink
            data={original.srcTwinStatus}
            twinClassId={original.twinflow?.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },

  dstTwinStatusId: {
    id: "dstTwinStatusId",
    accessorKey: "dstTwinStatusId",
    header: "To",
    cell: ({ row: { original } }) =>
      original.dstTwinStatus && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink
            data={original.dstTwinStatus}
            twinClassId={original.twinflow?.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },
  permissionId: {
    id: "permissionId",
    accessorKey: "permissionId",
    header: "Permission",
    cell: ({ row: { original } }) =>
      original.permission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.permission} withTooltip />
        </div>
      ),
  },

  inbuiltTwinFactoryId: {
    id: "inbuiltTwinFactoryId",
    accessorKey: "inbuiltTwinFactoryId",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.inbuiltTwinFactory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.inbuiltTwinFactory} withTooltip />
        </div>
      ),
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
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

export function TwinFlowTransitionsTable({
  twinflow,
}: {
  twinflow?: TwinFlow;
}) {
  const router = useRouter();
  const { buildFilterFields, mapFiltersToPayload } =
    useTwinFlowTransitionFilters({
      twinClassId: twinflow?.twinClassId,
      enabledFilters: isTruthy(twinflow?.id)
        ? [
            "idList",
            "aliasLikeList",
            "nameLikeList",
            "descriptionLikeList",
            "srcStatusIdList",
            "dstStatusIdList",
            "permissionIdList",
            "inbuiltTwinFactoryIdList",
          ]
        : undefined,
    });
  const { searchTwinFlowTransitions } = useTwinFlowTransitionSearchV1();
  const { createTwinFlowTransition } = useCreateTwinFlowTransition();

  const form = useForm<TwinFlowTransitionFormValues>({
    resolver: zodResolver(TWIN_FLOW_TRANSITION_SCHEMA),
    defaultValues: {
      twinflow: twinflow?.id ?? "",
      name: "",
      description: "",
      srcTwinStatusId: undefined,
      dstTwinStatusId: "",
      permissionId: undefined,
    },
  });

  const fetchTransitions = useCallback(
    async (
      pagination: PaginationState,
      filters: FiltersState
    ): Promise<PagedResponse<TwinFlowTransition_DETAILED>> => {
      const _filters = mapFiltersToPayload(filters.filters);

      try {
        const response = await searchTwinFlowTransitions({
          pagination,
          filters: {
            ..._filters,
            twinflowIdList: twinflow?.id
              ? toArrayOfString(toArray(twinflow?.id), "id")
              : _filters.twinflowIdList,
          },
        });

        return response;
      } catch (error) {
        toast.error("Failed to fetch twin-flow-transitions");
        return { data: [], pagination: {} };
      }
    },
    [searchTwinFlowTransitions, twinflow?.id]
  );

  async function handleCreate(
    formValues: z.infer<typeof TWIN_FLOW_TRANSITION_SCHEMA>
  ) {
    const body: TwinFlowTransitionCreateRq = {
      alias: formValues.alias,
      nameI18n: {
        translations: {
          en: formValues.name,
        },
      },
      descriptionI18n: formValues.description
        ? {
            translations: {
              en: formValues.description,
            },
          }
        : undefined,
      inbuiltTwinFactoryId: formValues.factory,
      srcStatusId: formValues.srcTwinStatusId,
      dstStatusId: formValues.dstTwinStatusId,
      permissionId: formValues.permissionId,
    };

    await createTwinFlowTransition({
      twinFlowId: formValues.twinflow,
      body,
    });
    toast.success("Transition created successfully!");
  }

  return (
    <CrudDataTable
      title="Transitions"
      className="mx-auto mb-10 flex-col p-8 lg:flex lg:justify-center"
      columns={[
        colDefs.id,
        colDefs.twinflowId,
        colDefs.name,
        colDefs.alias,
        colDefs.srcTwinStatusId,
        colDefs.dstTwinStatusId,
        colDefs.permissionId,
        colDefs.inbuiltTwinFactoryId,
        colDefs.description,
        colDefs.createdAt,
      ]}
      fetcher={fetchTransitions}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(
          `/${PlatformArea.core}/twinclass/${row.twinflow?.twinClassId}/twinflow/${row.twinflowId}/transition/${row.id}`
        )
      }
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(twinflow?.id) ? [colDefs.twinflowId] : []),
        colDefs.name,
        colDefs.alias,
        colDefs.srcTwinStatusId,
        colDefs.dstTwinStatusId,
        colDefs.permissionId,
        colDefs.inbuiltTwinFactoryId,
        colDefs.description,
        colDefs.createdAt,
      ]}
      orderedColumns={Object.values(colDefs)}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => (
        <TwinFlowTransitionFormFields control={form.control} />
      )}
    />
  );
}
