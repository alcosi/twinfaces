"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  TRIGGER_SCHEMA,
  TriggersFormValues,
  TwinFlowTransitionTrigger,
  useCreateTransitionTrigger,
  useTwinFlowTransitionTriggersSearchV1,
  //useUpdateTransitionTrigger,
} from "@/entities/twin-flow-transition";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";

import { TriggersFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinFlowTransitionTrigger,
    "id" | "order" | "transitionTriggerFeaturerId" | "active"
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

  transitionTriggerFeaturerId: {
    id: "transitionTriggerFeaturerId",
    accessorKey: "transitionTriggerFeaturerId",
    header: "Featurer",
  },

  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => {
      return data.getValue() ? <Check /> : null;
    },
  },
};

export function TwinflowTransitionTriggers() {
  const router = useRouter();
  const { transitionId } = useContext(TwinFlowTransitionContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinFlowTransitionTriggers } =
    useTwinFlowTransitionTriggersSearchV1();
  const { createTransitionTrigger } = useCreateTransitionTrigger();

  async function fetchData() {
    const response = await searchTwinFlowTransitionTriggers({
      filters: {
        twinflowTransitionIdList: [transitionId],
      },
    });
    return response;
  }

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(TRIGGER_SCHEMA),
    defaultValues: {
      order: 0,
      active: true,
    },
  });

  async function createTrigger(formValues: TriggersFormValues) {
    try {
      await createTransitionTrigger({
        body: {
          trigger: {
            twinflowTransitionId: transitionId,
            order: formValues.order,
            transitionTriggerFeaturerId: formValues.triggerFeaturerId,
            active: formValues.active,
            transitionTriggerParams: formValues.triggerParams,
          },
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
        colDefs.order,
        colDefs.transitionTriggerFeaturerId,
        colDefs.active,
      ]}
      getRowId={(x) => x.id!}
      fetcher={fetchData}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/transition-triggers/${row.id}`)
      }
      disablePagination={true}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.order,
        colDefs.transitionTriggerFeaturerId,
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
