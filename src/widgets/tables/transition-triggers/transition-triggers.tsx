"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  TransitionTrigger_DETAILED,
  useTransitionTriggerCreate,
  useTransitionTriggerSearch,
} from "@/entities/transition-trigger";
import { TRIGGER_SCHEMA_IMPORT } from "@/entities/transition-trigger/libs";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition/context-provider";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PlatformArea } from "@/shared/config";
import { isFalsy } from "@/shared/libs/index";
import { GuidWithCopy } from "@/shared/ui/guid";

import { CrudDataTable, DataTableHandle } from "../../crud-data-table";
import { TriggersFormFields } from "./form-fields";

type TriggersFormValues = z.infer<typeof TRIGGER_SCHEMA_IMPORT>;

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

export function TransitionTriggersTable() {
  const router = useRouter();
  const { transitionId } = useContext(TwinFlowTransitionContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTransitionTriggers } = useTransitionTriggerSearch();
  const { createTransitionTrigger } = useTransitionTriggerCreate();

  async function fetchData() {
    return searchTransitionTriggers({
      pagination: { pageIndex: 0, pageSize: 100 },
      filters: {
        ...(transitionId ? { twinflowTransitionIdList: [transitionId] } : {}),
      },
    });
  }

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(TRIGGER_SCHEMA_IMPORT),
    defaultValues: {
      ...(transitionId ? { twinflowTransitionId: transitionId } : {}),
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
      toast.success("Trigger created successfully");
    } catch (e) {
      toast.error("Failed to create trigger");
      throw e;
    }
  }

  return (
    <CrudDataTable
      ref={tableRef}
      className="mt-4"
      title="Triggers"
      columns={[
        colDefs.id,
        ...(isFalsy(transitionId) ? [colDefs.twinflowTransitionId] : []),
        colDefs.order,
        colDefs.twinTriggerId,
        colDefs.async,
        colDefs.active,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchData}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/transition-triggers/${row.id}`)
      }
      disablePagination={true}
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(transitionId) ? [colDefs.twinflowTransitionId] : []),
        colDefs.order,
        colDefs.twinTriggerId,
        colDefs.async,
        colDefs.active,
      ]}
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
