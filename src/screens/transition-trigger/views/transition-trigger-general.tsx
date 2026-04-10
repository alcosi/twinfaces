import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useTransitionTriggerUpdate } from "@/entities/transition-trigger";
import { useTransitionSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TransitionTriggerContext } from "@/features/transition-trigger";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TransitionTriggerGeneral() {
  const { transitionTrigger, refresh } = useContext(TransitionTriggerContext);
  const { updateTransitionTrigger } = useTransitionTriggerUpdate();
  const { confirm } = useActionDialogs();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const transitionAdapter = useTransitionSelectAdapter();

  const twinTriggerSettings: InPlaceEditProps<
    typeof transitionTrigger.twinTriggerId
  > = {
    id: "twinTriggerId",
    value: transitionTrigger.twinTriggerId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin trigger...",
      ...twinTriggerAdapter,
    },
    renderPreview: transitionTrigger.twinTrigger
      ? () => (
          <TwinTriggerResourceLink
            data={transitionTrigger.twinTrigger!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateTransitionTrigger({
        body: {
          transitionTriggers: [
            {
              id: transitionTrigger.id,
              twinTriggerId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const twinflowTransitionSettings: InPlaceEditProps<
    typeof transitionTrigger.twinflowTransitionId
  > = {
    id: "twinflowTransitionId",
    value: transitionTrigger.twinflowTransitionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select transition...",
      ...transitionAdapter,
    },
    renderPreview: transitionTrigger.twinflowTransition
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
        body: {
          transitionTriggers: [
            {
              id: transitionTrigger.id,
              twinflowTransitionId: id,
            },
          ],
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
        body: {
          transitionTriggers: [
            {
              id: transitionTrigger.id,
              order: value as number,
            },
          ],
        },
      }).then(refresh);
    },
  };

  function switchActive() {
    const action = transitionTrigger.active ? "disable" : "enable";
    const status = transitionTrigger.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this transition trigger?`,
      onSuccess: () => {
        return updateTransitionTrigger({
          body: {
            transitionTriggers: [
              {
                id: transitionTrigger.id,
                active: !transitionTrigger.active,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  function switchAsync() {
    const action = transitionTrigger.async ? "disable" : "enable";
    const status = transitionTrigger.async ? "Disable" : "Enable";

    confirm({
      title: `${status} Async`,
      body: `Are you sure you want to ${action} action for this transition trigger?`,
      onSuccess: () => {
        return updateTransitionTrigger({
          body: {
            transitionTriggers: [
              {
                id: transitionTrigger.id,
                async: !transitionTrigger.async,
              },
            ],
          },
        }).then(refresh);
      },
    });
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
              <InPlaceEdit {...twinflowTransitionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>
              <InPlaceEdit {...orderSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={transitionTrigger.active ?? false}
                onCheckedChange={switchActive}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin trigger</TableCell>
            <TableCell>
              <InPlaceEdit {...twinTriggerSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Async</TableCell>
            <TableCell>
              <Switch
                checked={transitionTrigger.async ?? false}
                onCheckedChange={switchAsync}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
