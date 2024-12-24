import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { FeaturerTypes } from "@/entities/featurer";
import {
  TwinFlowTransitionValidator,
  TwinFlowTransitionValidatorUpdate,
} from "@/entities/twinFlowTransition";
import { ApiContext } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";
import { useContext } from "react";
import { toast } from "sonner";

export interface TwinflowTransitionValidatorDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  transitionId: string;
  // TODO: fix `any` when <CrudDataTable /> is replaced with <Experimental_CrudDataTable />
  validator: any | null;
  onSuccess?: () => any;
}

export function TwinflowTransitionValidatorDialog({
  transitionId,
  validator,
  onSuccess,
  ...props
}: TwinflowTransitionValidatorDialogProps) {
  const api = useContext(ApiContext);

  async function createUpdateValidator(
    newValidator: TwinFlowTransitionValidatorUpdate
  ) {
    try {
      const result = await api.twinFlowTransition.update({
        transitionId: transitionId,
        body: {
          validatorRules:
            validator != null
              ? {
                  update: [{ ...newValidator, id: validator.id }],
                }
              : {
                  create: [newValidator],
                },
        },
      });
      if (result.error) {
        console.error(result.error);
        throw new Error(
          `Failed to ${validator ? "update" : "create"} validator`
        );
      }
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${validator ? "update" : "create"} validator`);
      throw e;
    }
  }

  const validatorAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      order: validator?.order,
      active: validator?.active ?? false,
      validatorFeaturerId: isPopulatedArray(validator?.twinValidators)
        ? validator.twinValidators[0]?.validatorFeaturerId.id
        : undefined,
      validatorParams: isPopulatedArray(validator?.twinValidators)
        ? validator.twinValidators[0]?.validatorFeaturerId.params
        : undefined,
      invert: isPopulatedArray(validator?.twinValidators)
        ? validator.twinValidators[0]?.invert
        : false,
    },
    title: validator ? "Update validator" : "Create validator",
    onSubmit: (values) => {
      return createUpdateValidator(values);
    },
    valuesInfo: {
      order: {
        type: AutoFormValueType.number,
        label: "Order",
        defaultValue: 0,
      },
      active: {
        type: AutoFormValueType.boolean,
        label: "Active",
        defaultValue: false,
      },
      validatorFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Featurer",
        typeId: FeaturerTypes.validator,
      },
      invert: {
        type: AutoFormValueType.boolean,
        label: "Invert",
        defaultValue: false,
      },
    },
  };

  return <AutoDialog settings={validatorAutoDialogSettings} {...props} />;
}
