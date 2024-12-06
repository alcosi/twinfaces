import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { FeaturerTypes } from "@/entities/featurer";
import {
  TwinFlowTransitionTrigger,
  TwinFlowTransitionTriggerUpdate,
} from "@/entities/twinFlowTransition";
import { ApiContext } from "@/shared/api";
import { useContext } from "react";
import { toast } from "sonner";

export interface TwinflowTransitionTriggerDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  transitionId: string;
  trigger: TwinFlowTransitionTrigger | null;
  onSuccess?: () => any;
}

export function TwinflowTransitionTriggerDialog({
  transitionId,
  trigger,
  onSuccess,
  ...props
}: TwinflowTransitionTriggerDialogProps) {
  const api = useContext(ApiContext);

  async function createUpdateTrigger(
    newTrigger: TwinFlowTransitionTriggerUpdate
  ) {
    try {
      const result = await api.twinFlowTransition.update({
        transitionId: transitionId,
        body: {
          triggers:
            trigger != null
              ? {
                  update: [{ ...newTrigger, id: trigger.id }],
                }
              : {
                  create: [newTrigger],
                },
        },
      });
      if (result.error) {
        console.error(result.error);
        throw new Error(`Failed to ${trigger ? "update" : "create"} trigger`);
      }
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${trigger ? "update" : "create"} trigger`);
      throw e;
    }
  }

  const triggerAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      order: trigger?.order,
      active: trigger?.active ?? false,
      triggerFeaturerId: trigger?.triggerFeaturerId,
      triggerParams: trigger?.triggerParams,
    },
    title: trigger ? "Update trigger" : "Create trigger",
    onSubmit: (values) => {
      return createUpdateTrigger(values);
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
      triggerFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Featurer",
        typeId: FeaturerTypes.trigger,
        paramsName: "triggerParams",
      },
    },
  };

  return <AutoDialog settings={triggerAutoDialogSettings} {...props} />;
}
