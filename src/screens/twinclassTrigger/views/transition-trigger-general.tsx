import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  useTransitionSelectAdapter,
  useUpdateTransitionTrigger,
} from "@/entities/twin-flow-transition";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TransitionTriggerContext } from "@/features/twin-transition-trigger";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TransitionTriggerGeneral() {
  const { transitionTrigger, refresh } = useContext(TransitionTriggerContext);
  const transitionAdapter = useTransitionSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(15);
  const { updateTransitionTrigger } = useUpdateTransitionTrigger();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const transitionSettings: InPlaceEditProps<
    typeof transitionTrigger.twinflowTransitionId
  > = {
    id: "twinflowTransitionId",
    value: transitionTrigger.twinflowTransitionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select transition...",
      ...transitionAdapter,
    },
    renderPreview: transitionTrigger.twinflowTransitionId
      ? () => (
          <TwinFlowTransitionResourceLink
            data={transitionTrigger.twinflowTransition!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateTransitionTrigger({
        triggerId: transitionTrigger.id!,
        body: {
          trigger: {
            id: transitionTrigger.id,
            twinflowTransitionId: id,
          },
        },
      }).then(refresh);
    },
  };

  const orderSettings: InPlaceEditProps<typeof transitionTrigger.order> = {
    id: "order",
    value: transitionTrigger.order,
    valueInfo: {
      type: AutoFormValueType.number,
      label: "",
    },
    schema: z.coerce.number().min(0, "Order must be at least 0"),
    onSubmit: async (value) => {
      return updateTransitionTrigger({
        triggerId: transitionTrigger.id!,
        body: {
          trigger: {
            id: transitionTrigger.id,
            order: value,
          },
        },
      }).then(refresh);
    },
  };

  const featurerSettings: AutoEditDialogSettings = {
    value: {
      transitionTriggerFeaturerId:
        transitionTrigger.transitionTriggerFeaturerId,
    },
    title: "Update featurer",
    onSubmit: (values) => {
      return updateTransitionTrigger({
        triggerId: transitionTrigger.id!,
        body: {
          trigger: {
            id: transitionTrigger.id,
            transitionTriggerFeaturerId:
              values.transitionTriggerFeaturerId[0].id,
            transitionTriggerParams: values.transitionTriggerParams,
          },
        },
      }).then(refresh);
    },
    valuesInfo: {
      transitionTriggerFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Featurer",
        typeId: 15,
        paramsFieldName: "transitionTriggerParams",
        ...featurerAdapter,
      },
    },
  };

  const activeSettings: InPlaceEditProps<typeof transitionTrigger.active> = {
    id: "active",
    value: transitionTrigger.active,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateTransitionTrigger({
        triggerId: transitionTrigger.id!,
        body: {
          trigger: {
            id: transitionTrigger.id,
            active: value,
          },
        },
      }).then(refresh);
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={transitionTrigger.id || ""} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Transition</TableCell>
            <TableCell>
              <InPlaceEdit {...transitionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>
              <InPlaceEdit {...orderSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(featurerSettings)}
          >
            <TableCell>Featurer</TableCell>
            <TableCell>
              {transitionTrigger.transitionTriggerFeaturerId && (
                <FeaturerResourceLink
                  data={transitionTrigger.triggerFeaturer!}
                  params={transitionTrigger.transitionTriggerDetailedParams}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <InPlaceEdit {...activeSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </InPlaceEditContextProvider>
  );
}
