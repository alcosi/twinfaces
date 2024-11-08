import {
  TwinFlowTransitionValidator,
  TwinFlowTransitionValidatorUpdate,
} from "@/entities/twinFlow";
import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { ApiContext } from "@/shared/api";
import { useContext } from "react";
import { FeaturerTypes } from "@/components/featurer-input";
import { toast } from "sonner";
import { isPopulatedArray } from "@/shared/libs";

export interface TwinflowTransitionValidatorDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  transitionId: string;
  validator: TwinFlowTransitionValidator | null;
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
      const result = await api.twinflow.updateTransition({
        transitionId: transitionId,
        data: {
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
        ? validator.twinValidators[0]?.validatorFeaturerId
        : undefined,
      validatorParams: isPopulatedArray(validator?.twinValidators)
        ? validator.twinValidators[0]?.validatorParams
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
        paramsName: "validatorParams",
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
