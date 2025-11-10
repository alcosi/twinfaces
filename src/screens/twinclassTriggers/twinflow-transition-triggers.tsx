import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  TRIGGER_SCHEMA,
  TriggersFormValues,
  TwinFlowTransitionTrigger,
  TwinFlowTransitionTriggerUpdate,
  useTwinFlowTransitionTriggersSearch,
  useUpdateTwinFlowTransition,
} from "@/entities/twin-flow-transition";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";

import { TriggersFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinFlowTransitionTrigger,
    "id" | "order" | "triggerFeaturerId" | "active"
  >,
  ColumnDef<TwinFlowTransitionTrigger>
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

  triggerFeaturerId: {
    id: "triggerFeaturerId",
    accessorKey: "triggerFeaturerId",
    header: "Featurer",
  },

  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => {
      data.getValue() && <Check />;
    },
  },
};

export function TwinflowTransitionTriggers() {
  const { transitionId } = useContext(TwinFlowTransitionContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchTriggers } = useTwinFlowTransitionTriggersSearch();
  const { updateTwinFlowTransition } = useUpdateTwinFlowTransition();

  async function fetchData() {
    const response = await fetchTriggers({ transitionId: transitionId });
    return response;
  }

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(TRIGGER_SCHEMA),
    defaultValues: {
      order: 0,
      active: true,
      triggerParams: {},
      triggerFeaturerId: 0,
    },
  });

  async function createTrigger(formValues: TriggersFormValues) {
    const body: TwinFlowTransitionTriggerUpdate = {
      order: formValues.order,
      triggerFeaturerId: formValues.triggerFeaturerId,
      active: formValues.active,
      triggerParams: formValues.triggerParams,
    };

    try {
      await updateTwinFlowTransition({
        transitionId: transitionId,
        body: {
          triggers: { create: [body] },
        },
      });
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
        colDefs.order,
        colDefs.triggerFeaturerId,
        colDefs.active,
      ]}
      getRowId={(x) => x.id!}
      fetcher={fetchData}
      disablePagination={true}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.order,
        colDefs.triggerFeaturerId,
        colDefs.active,
      ]}
      dialogForm={triggersForm}
      onCreateSubmit={createTrigger}
      renderFormFields={() => (
        <TriggersFormFields control={triggersForm.control} />
      )}
    />
  );
}
