import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  TRANSITION_TRIGGER_SCHEMA,
  TransitionTriggerFilterKeys,
  TransitionTrigger_DETAILED,
  useTransitionTriggerCreate,
  useTransitionTriggerSearch,
} from "@/entities/transition-trigger";
import { useTransitionTriggerFilters } from "@/entities/transition-trigger/libs";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PagedResponse } from "@/shared/api/types";
import { PlatformArea } from "@/shared/config";
import {
  isFalsy,
  isTruthy,
  isUndefined,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TriggersFormFields } from "./form-fields";

type TriggersFormValues = z.infer<typeof TRANSITION_TRIGGER_SCHEMA>;

const colDefs: Record<
  keyof Pick<
    TransitionTrigger_DETAILED,
    | "id"
    | "order"
    | "twinTriggerId"
    | "twinflowTransitionId"
    | "active"
    | "async"
  >,
  ColumnDef<TransitionTrigger_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  order: {
    id: "order",
    accessorKey: "order",
    header: "Order",
  },
  twinTriggerId: {
    id: "twinTriggerId",
    accessorKey: "twinTriggerId",
    header: "Twin trigger",
    cell: ({ row: { original } }) =>
      original.twinTrigger && (
        <div className="inline-flex max-w-48">
          <TwinTriggerResourceLink data={original.twinTrigger} withTooltip />
        </div>
      ),
  },
  twinflowTransitionId: {
    id: "twinflowTransitionId",
    accessorKey: "twinflowTransitionId",
    header: "Transition",
    cell: ({ row: { original } }) =>
      original.twinflowTransition && (
        <div className="inline-flex max-w-48">
          <TwinFlowTransitionResourceLink
            data={original.twinflowTransition}
            withTooltip
          />
        </div>
      ),
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  async: {
    id: "async",
    accessorKey: "async",
    header: "Async",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function TransitionTriggersTable({
  twinTriggerId,
}: {
  twinTriggerId?: string;
}) {
  const router = useRouter();
  const { transitionId } = useContext(TwinFlowTransitionContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTransitionTriggers } = useTransitionTriggerSearch();
  const { createTransitionTrigger } = useTransitionTriggerCreate();
  const { buildFilterFields, mapFiltersToPayload } =
    useTransitionTriggerFilters({
      enabledFilters:
        isTruthy(transitionId) || isTruthy(twinTriggerId)
          ? ([
              "idList",
              isUndefined(transitionId) && "twinflowTransitionIdList",
              "incomingElseOutgoing",
              isUndefined(twinTriggerId) && "twinTriggerIdList",
              "active",
              "async",
            ].filter(Boolean) as TransitionTriggerFilterKeys[])
          : undefined,
    });

  async function fetchData(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TransitionTrigger_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTransitionTriggers({
        pagination,
        filters: {
          ..._filters,
          twinflowTransitionIdList: transitionId
            ? toArrayOfString(toArray(transitionId), "id")
            : _filters.twinflowTransitionIdList,
          twinTriggerIdList: twinTriggerId
            ? toArrayOfString(toArray(twinTriggerId), "id")
            : _filters.twinTriggerIdList,
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching transition triggers: " + error
      );
      throw new Error(
        "An error occured while fetching transition triggers: " + error
      );
    }
  }

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(TRANSITION_TRIGGER_SCHEMA),
    defaultValues: {
      twinflowTransitionId: transitionId || "",
      twinTriggerId: twinTriggerId || "",
      order: 0,
      active: true,
      async: false,
    },
  });

  async function createTrigger(formValues: TriggersFormValues) {
    try {
      await createTransitionTrigger({
        body: {
          transitionTriggers: [
            {
              ...(transitionId
                ? { twinflowTransitionId: transitionId }
                : { twinflowTransitionId: formValues.twinflowTransitionId }),
              twinTriggerId: formValues.twinTriggerId,
              order: formValues.order,
              active: formValues.active,
              async: formValues.async,
            },
          ],
        },
      });

      tableRef.current?.refresh();
      toast.success("Transition trigger created successfully");
    } catch (e) {
      toast.error("Failed to create transition trigger");
      throw e;
    }
  }

  return (
    <CrudDataTable
      permissionSegment="transition-triggers"
      ref={tableRef}
      title="Transition triggers"
      columns={[
        colDefs.id,
        ...(isFalsy(transitionId) ? [colDefs.twinflowTransitionId] : []),
        colDefs.order,
        ...(twinTriggerId ? [] : [colDefs.twinTriggerId]),
        colDefs.async,
        colDefs.active,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchData}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/transition-triggers/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(transitionId) ? [colDefs.twinflowTransitionId] : []),
        colDefs.order,
        ...(twinTriggerId ? [] : [colDefs.twinTriggerId]),
        colDefs.async,
        colDefs.active,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={triggersForm}
      onCreateSubmit={createTrigger}
      renderFormFields={() => (
        <TriggersFormFields
          control={triggersForm.control}
          transitionId={transitionId}
        />
      )}
    />
  );
}
