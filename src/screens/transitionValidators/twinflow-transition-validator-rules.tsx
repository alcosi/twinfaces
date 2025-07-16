import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";

import {
  TwinFlowTransitionValidator,
  TwinFlowTransitionValidatorCreate,
  VALIDATOR_RULES_SCHEMA,
  ValidatorRulesFormValues,
  useTwinFlowTransitionValidatorRulesSearch,
  useUpdateTwinFlowTransition,
} from "@/entities/twin-flow-transition";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";

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

export function TwinflowTransitionValidatorRules() {
  const tableRef = useRef<DataTableHandle>(null);
  const { transitionId } = useContext(TwinFlowTransitionContext);
  const { fetchValidatorRules } = useTwinFlowTransitionValidatorRulesSearch();
  const { updateTwinFlowTransition } = useUpdateTwinFlowTransition();

  async function fetchData() {
    const response = await fetchValidatorRules({
      transitionId: transitionId,
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
    const body: TwinFlowTransitionValidatorCreate = {
      order: formValues.order,
      active: formValues.active,
    };

    await updateTwinFlowTransition({
      transitionId: transitionId,
      body: {
        validatorRules: { create: [body] },
      },
    });
  }

  return (
    <CrudDataTable
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
