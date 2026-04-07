import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useTransitionTriggerUpdate } from "@/entities/transition-trigger";
import { useTransitionSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger/libs";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TransitionTriggerContext } from "@/features/transition-trigger";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TransitionTriggerGeneral() {
  const { transitionTrigger, refresh } = useContext(TransitionTriggerContext);
  const { updateTransitionTrigger } = useTransitionTriggerUpdate();
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
        body: {
          transitionTriggers: [
            {
              id: transitionTrigger.id,
              active: value as boolean,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const asyncSettings: InPlaceEditProps<typeof transitionTrigger.async> = {
    id: "async",
    value: transitionTrigger.async,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateTransitionTrigger({
        body: {
          transitionTriggers: [
            {
              id: transitionTrigger.id,
              async: value as boolean,
            },
          ],
        },
      }).then(refresh);
    },
  };

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
              <InPlaceEdit {...activeSettings} />
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
              <InPlaceEdit {...asyncSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
