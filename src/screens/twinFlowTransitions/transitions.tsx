import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PermissionResourceLink } from "@/entities/permission";
import {
  TWIN_FLOW_TRANSITION_SCHEMA,
  TwinFlowTransition,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionFormValues,
  TwinFlowTransitionResourceLink,
  TwinFlowTransition_DETAILED,
  useTwinFlowTransitionFilters,
  useTwinFlowTransitionSearchV1,
} from "@/entities/twin-flow-transition";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

import { TwinFlowTransitionFormFields } from "./form-fields";

function buildColumnDefs({
  twinClassId,
  twinFlowId,
}: {
  twinClassId: string;
  twinFlowId: string;
}) {
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
      | "createdAt"
    >,
    ColumnDef<TwinFlowTransition_DETAILED>
  > = {
    id: {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
    },
    name: {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row: { original } }) => {
        return (
          <div className="max-w-48 inline-flex">
            <TwinFlowTransitionResourceLink
              data={original}
              twinClassId={twinClassId}
              twinFlowId={twinFlowId}
              withTooltip
            />
          </div>
        );
      },
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
              twinClassId={twinClassId}
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
              twinClassId={twinClassId}
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

  return colDefs;
}

export function TwinFlowTransitions({ twinClassId, twinFlowId }: any) {
  const colDefs = buildColumnDefs({ twinClassId, twinFlowId });
  const api = useContext(PrivateApiContext);
  const router = useRouter();
  const { buildFilterFields, mapFiltersToPayload } =
    useTwinFlowTransitionFilters(twinClassId);
  const { searchTwinFlowTransitions } = useTwinFlowTransitionSearchV1();

  const form = useForm<TwinFlowTransitionFormValues>({
    resolver: zodResolver(TWIN_FLOW_TRANSITION_SCHEMA),
    defaultValues: {
      alias: "",
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
            twinflowIdList: [twinFlowId],
          },
        });

        return response;
      } catch (error) {
        toast.error("Failed to fetch transitions");
        return { data: [], pagination: {} };
      }
    },
    [searchTwinFlowTransitions, twinFlowId]
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
      srcStatusId: formValues.srcTwinStatusId,
      dstStatusId: formValues.dstTwinStatusId,
      permissionId: formValues.permissionId,
    };

    const { error } = await api.twinFlowTransition.create({ twinFlowId, body });
    if (error) {
      throw error;
    }
    toast.success("Twinflow transition created successfully!");
  }

  return (
    <CrudDataTable
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      columns={Object.values(colDefs)}
      fetcher={fetchTransitions}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(
          `/workspace/twinclass/${twinClassId}/twinflow/${twinFlowId}/transition/${row.id}`
        )
      }
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.alias,
        colDefs.srcTwinStatusId,
        colDefs.dstTwinStatusId,
        colDefs.permissionId,
        colDefs.description,
        colDefs.createdAt,
      ]}
      orderedColumns={Object.values(colDefs)}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => (
        <TwinFlowTransitionFormFields
          twinClassId={twinClassId}
          control={form.control}
        />
      )}
    />
  );
}
