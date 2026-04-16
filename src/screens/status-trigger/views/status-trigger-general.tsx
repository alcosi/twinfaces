import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useStatusTriggerUpdate } from "@/entities/status-trigger";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { StatusTriggerContext } from "@/features/status-trigger";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
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

export function StatusTriggerGeneral() {
  const { statusTriggerId, statusTrigger, refresh } =
    useContext(StatusTriggerContext);
  const { updateStatusTrigger } = useStatusTriggerUpdate();
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const { confirm } = useActionDialogs();

  const twinStatusSettings: InPlaceEditProps<
    typeof statusTrigger.twinStatusId
  > = {
    id: "twinStatusId",
    value: statusTrigger.twinStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin status...",
      ...twinStatusAdapter,
    },
    renderPreview: statusTrigger.twinStatus
      ? () => (
          <TwinClassStatusResourceLink
            data={statusTrigger.twinStatus!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const selected = (value as unknown as Array<{ id: string }>)[0];
      return updateStatusTrigger({
        body: {
          twinStatusTriggers: [
            { id: statusTriggerId, twinStatusId: selected?.id },
          ],
        },
      }).then(refresh);
    },
  };

  function switchIncomingOutgoing() {
    const action = statusTrigger.incomingElseOutgoing ? "incoming" : "outgoing";
    const status = statusTrigger.incomingElseOutgoing ? "Incoming" : "Outgoing";

    confirm({
      title: `Change to ${status}`,
      body: `Are you sure you want to switch ${action} action for this status trigger`,
      onSuccess: () => {
        return updateStatusTrigger({
          body: {
            twinStatusTriggers: [
              {
                id: statusTriggerId,
                incomingElseOutgoing: !statusTrigger.incomingElseOutgoing,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  const orderSettings: InPlaceEditProps<typeof statusTrigger.order> = {
    id: "order",
    value: statusTrigger.order,
    valueInfo: {
      type: AutoFormValueType.number,
      label: "",
    },
    schema: z.coerce.number().min(0, "Order must be at least 0"),
    onSubmit: async (value) => {
      return updateStatusTrigger({
        body: {
          twinStatusTriggers: [{ id: statusTriggerId, order: value as number }],
        },
      }).then(refresh);
    },
  };

  const twinTriggerSettings: InPlaceEditProps<
    typeof statusTrigger.twinTriggerId
  > = {
    id: "twinTriggerId",
    value: statusTrigger.twinTriggerId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin trigger...",
      ...twinTriggerAdapter,
    },
    renderPreview: statusTrigger.twinTrigger
      ? () => (
          <TwinTriggerResourceLink
            data={statusTrigger.twinTrigger!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const selected = (value as unknown as Array<{ id: string }>)[0];
      return updateStatusTrigger({
        body: {
          twinStatusTriggers: [
            { id: statusTriggerId, twinTriggerId: selected?.id },
          ],
        },
      }).then(refresh);
    },
  };

  function switchAsync() {
    const action = statusTrigger.async ? "disable" : "enable";
    const status = statusTrigger.async ? "Disable" : "Enable";

    confirm({
      title: `${status} Async`,
      body: `Are you sure you want to ${action} action for this status trigger`,
      onSuccess: () => {
        return updateStatusTrigger({
          body: {
            twinStatusTriggers: [
              { id: statusTriggerId, async: !statusTrigger.async },
            ],
          },
        }).then(refresh);
      },
    });
  }

  function switchActive() {
    const action = statusTrigger.active ? "disable" : "enable";
    const status = statusTrigger.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this status trigger`,
      onSuccess: () => {
        return updateStatusTrigger({
          body: {
            twinStatusTriggers: [
              { id: statusTriggerId, active: !statusTrigger.active },
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
              <GuidWithCopy value={statusTrigger.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin status</TableCell>
            <TableCell>
              <InPlaceEdit {...twinStatusSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Incoming else outgoing</TableCell>
            <TableCell>
              <Switch
                checked={statusTrigger.incomingElseOutgoing ?? false}
                onCheckedChange={switchIncomingOutgoing}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>
              <InPlaceEdit {...orderSettings} />
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
                checked={statusTrigger.async ?? false}
                onCheckedChange={switchAsync}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={statusTrigger.active ?? false}
                onCheckedChange={switchActive}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
