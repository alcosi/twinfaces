import {
  TwinFlowTransition,
  TwinFlowTransitionValidator,
  TwinFlowTransitionValidatorCreate,
  useTwinFlowTransitionValidatorRulesSearch,
  VALIDATOR_RULES_SCHEMA,
  ValidatorRulesFormValues,
} from "@/entities/twinFlowTransition";
import { useContext, useRef } from "react";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/table-core";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiContext } from "@/shared/api";
import { TransitionValidatorFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinFlowTransitionValidator,
    "id" | "order" | "twinValidatorSetId" | "active"
  >,
  ColumnDef<TwinFlowTransitionValidator>
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

  twinValidatorSetId: {
    id: "twinValidatorSetId",
    accessorKey: "twinValidatorSetId",
    header: "Validators set",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },
};

export function TwinflowTransitionValidatorRules({
  transition,
}: {
  transition: TwinFlowTransition;
}) {
  const api = useContext(ApiContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchValidatorRules } = useTwinFlowTransitionValidatorRulesSearch();

  async function fetchData() {
    const response = await fetchValidatorRules({
      transitionId: transition.id!,
    });
    return response;
  }

  const validatorRulesForm = useForm<ValidatorRulesFormValues>({
    resolver: zodResolver(VALIDATOR_RULES_SCHEMA),
    defaultValues: {
      order: 0,
      active: false,
    },
  });

  async function createValidator(formValues: ValidatorRulesFormValues) {
    if (!transition.id) {
      console.error("Create Validator: no transition");
      return;
    }

    const body: TwinFlowTransitionValidatorCreate = {
      order: formValues.order,
      active: formValues.active,
    };

    try {
      const result = await api.twinFlowTransition.update({
        transitionId: transition.id,
        body: {
          validatorRules: { create: [body] },
        },
      });
      if (result.error) {
        throw new Error("Failed to create validators");
      }
    } catch (e) {
      toast.error("Failed to create validators");
      throw e;
    }
  }

  return (
    <Experimental_CrudDataTable
      ref={tableRef}
      title="Validator rules"
      columns={[
        colDefs.id,
        colDefs.order,
        colDefs.twinValidatorSetId,
        colDefs.active,
      ]}
      getRowId={(x) => x.id!}
      fetcher={fetchData}
      disablePagination={true}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.order,
        colDefs.twinValidatorSetId,
        colDefs.active,
      ]}
      dialogForm={validatorRulesForm}
      onCreateSubmit={createValidator}
      renderFormFields={() => (
        <TransitionValidatorFormFields control={validatorRulesForm.control} />
      )}
    />
  );
}
