import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { PermissionResourceLink } from "@/entities/permission";
import {
  TwinClassStatus,
  TwinClassStatusResourceLink,
} from "@/entities/twinClassStatus";
import {
  buildFilterFields,
  mapToTwinFlowTransitionApiFilters,
  TF_Transition_DETAILED,
  TWIN_FLOW_TRANSITION_SCHEMA,
  TF_Transition,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionFormValues,
  TwinFlowTransitionResourceLink,
  TwinFlowTransitionUpdateRq,
  useTwinFlowTransitionSearchV1,
} from "@/entities/twinFlowTransition";
import { UserResourceLink } from "@/entities/user";
import { ApiContext } from "@/shared/api";
import { mergeUniqueItems } from "@/shared/libs";
import { Experimental_CrudDataTable } from "@/widgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
      TF_Transition,
      | "id"
      | "alias"
      | "name"
      | "description"
      | "srcTwinStatusId"
      | "dstTwinStatusId"
      | "permissionId"
      | "createdByUserId"
    >,
    ColumnDef<TF_Transition>
  > = {
    id: {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    alias: {
      id: "alias",
      accessorKey: "alias",
      header: "Alias",
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
    description: {
      id: "description",
      accessorKey: "description",
      header: "Description",
    },
    srcTwinStatusId: {
      id: "srcTwinStatusId",
      accessorKey: "srcTwinStatusId",
      header: "From",
      cell: ({ row: { original } }) =>
        original.srcTwinStatus && (
          <div className="max-w-48 inline-flex">
            <TwinClassStatusResourceLink
              data={original.srcTwinStatus as TwinClassStatus}
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
              data={original.dstTwinStatus as TwinClassStatus}
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
    createdByUserId: {
      id: "createdByUserId",
      accessorKey: "createdByUserId",
      header: "Created By",
      cell: ({ row: { original } }) =>
        original.createdByUser && (
          <div className="max-w-48 inline-flex">
            <UserResourceLink data={original.createdByUser} withTooltip />
          </div>
        ),
    },
  };

  return colDefs;
}

export function TwinFlowTransitions({ twinClassId, twinFlowId }: any) {
  const colDefs = buildColumnDefs({ twinClassId, twinFlowId });
  const api = useContext(ApiContext);
  const [transitions, setTransitions] = useState<TF_Transition_DETAILED[]>([]);
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
    ): Promise<{ data: TF_Transition_DETAILED[]; pageCount: number }> => {
      const _filters = mapToTwinFlowTransitionApiFilters(filters.filters);

      try {
        const response = await searchTwinFlowTransitions({
          pagination,
          filters: {
            ..._filters,
            twinflowIdList: [twinFlowId],
          },
        });

        const transitions = response.data ?? [];
        setTransitions((prev) => mergeUniqueItems(prev, transitions));

        return response;
      } catch (error) {
        toast.error("Failed to fetch transitions");
        return { data: [], pageCount: 0 };
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
    toast.success("Link created successfully!");
  }

  async function handleUpdate(
    transitionId: string,
    formValues: z.infer<typeof TWIN_FLOW_TRANSITION_SCHEMA>
  ) {
    const body: TwinFlowTransitionUpdateRq = {
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

    const { error } = await api.twinFlowTransition.update({
      transitionId,
      body,
    });
    if (error) {
      throw error;
    }
    toast.success("Permission updated successfully!");
  }
  return (
    <Experimental_CrudDataTable
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      columns={Object.values(colDefs)}
      fetcher={fetchTransitions}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(transitions),
        onChange: () => Promise.resolve(),
      }}
      defaultVisibleColumns={[
        // colDefs.id,
        // colDefs.alias,
        colDefs.name,
        // colDefs.description,
        colDefs.srcTwinStatusId,
        colDefs.dstTwinStatusId,
        colDefs.permissionId,
        colDefs.createdByUserId,
      ]}
      orderedColumns={Object.values(colDefs)}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      onUpdateSubmit={handleUpdate}
      renderFormFields={() => (
        <TwinFlowTransitionFormFields control={form.control} />
      )}
    />
  );
}
