import {
  TRIGGER_SCHEMA,
  TriggersFormValues,
  TwinFlowTransition,
  TwinFlowTransitionTrigger,
  TwinFlowTransitionTriggerUpdate,
  useTwinFlowTransitionTriggersSearch,
} from "@/entities/twin-flow-transition";
import { ApiContext } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

export function TwinflowTransitionTriggers({
  transition,
}: {
  transition: TwinFlowTransition;
}) {
  const tableRef = useRef<DataTableHandle>(null);
  const api = useContext(ApiContext);
  const { fetchTriggers } = useTwinFlowTransitionTriggersSearch();

  async function fetchData() {
    const response = await fetchTriggers({ transitionId: transition.id! });
    return response;
  }

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(TRIGGER_SCHEMA),
    defaultValues: {
      order: 0,
      active: false,
      triggerParams: {},
      triggerFeaturerId: 0,
    },
  });

  async function createTrigger(formValues: TriggersFormValues) {
    if (!transition.id) {
      console.error("Create trigger: no transition");
      return;
    }

    const body: TwinFlowTransitionTriggerUpdate = {
      order: formValues.order,
      triggerFeaturerId: formValues.triggerFeaturerId,
      active: formValues.active,
      triggerParams: formValues.triggerParams,
    };

    try {
      const result = await api.twinFlowTransition.update({
        transitionId: transition.id,
        body: {
          triggers: { create: [body] },
        },
      });
      if (result.error) {
        throw new Error("Failed to create trigger");
      }
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
