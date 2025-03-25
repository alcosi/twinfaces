import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FactoryResourceLink } from "@/entities/factory";
import { PermissionResourceLink } from "@/entities/permission";
import {
  TwinFlow,
  TwinFlowResourceLink,
  TwinFlow_DETAILED,
} from "@/entities/twin-flow";
import {
  TWIN_FLOW_TRANSITION_SCHEMA,
  TwinFlowTransition,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionFormValues,
  TwinFlowTransition_DETAILED,
  useTwinFlowTransitionFilters,
  useTwinFlowTransitionSearchV1,
} from "@/entities/twin-flow-transition";
import { useCreateTwinFlowTransition } from "@/entities/twin-flow-transition";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  formatToTwinfaceDate,
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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 column-flex space-y-2">
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
        <div className="max-w-48 inline-flex">
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
      original.createdAt && formatToTwinfaceDate(original.createdAt),
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
      twinflow: twinflow ? [twinflow] : [],
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
    // TODO: Extract new-created-alias from formValues and use it to populate body
    const body: TwinFlowTransitionCreateRq = {
      alias: formValues.alias?.[0]?.alias!,
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
      twinFlowId: twinflow?.id || formValues?.twinflow?.[0]?.id!,
      body,
    });
    toast.success("Transition created successfully!");
  }

  return (
    <CrudDataTable
      title="Transitions"
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
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
