import {
  TRIGGER_SCHEMA,
  TriggersFormValues,
  TwinFlowTransition,
  TwinFlowTransitionTrigger,
  TwinFlowTransitionTriggerUpdate,
  useTwinFlowTransitionTriggersSearch,
} from "@/entities/twinFlowTransition";
import { useContext, useRef } from "react";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/table-core";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets";
import { Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiContext } from "@/shared/api";
import { toast } from "sonner";
import { TriggersFormFields } from "@/screens/twinclassTriggers";

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
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },
};

export function TwinflowTransitionTriggers({
  transition,
  onChange,
}: {
  transition: TwinFlowTransition;
  onChange: () => any;
}) {
  const tableRef = useRef<DataTableHandle>(null);
  const api = useContext(ApiContext);
  const { fetchTriggers } = useTwinFlowTransitionTriggersSearch(transition.id!);

  async function fetchData() {
    const response = await fetchTriggers();
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

  async function updateTrigger(id: string, formValues: TriggersFormValues) {
    if (!transition.id) {
      console.error("Update trigger: no transition");
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
          triggers: { update: [{ ...body, id: id }] },
        },
      });
      if (result.error) {
        throw new Error("Failed to update trigger");
      }
    } catch (e) {
      toast.error("Failed to update trigger");
      throw e;
    }
  }

  return (
    <Experimental_CrudDataTable
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
      onUpdateSubmit={updateTrigger}
      renderFormFields={() => (
        <TriggersFormFields control={triggersForm.control} />
      )}
    />
  );
}
