"use client";

import { toast } from "sonner";

import { AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import {
  TwinFlowFactory_DETAILED,
  useFactoryLauncherSelectAdapter,
  useUpdateTwinFlowFactory,
} from "@/entities/twinflow-factory";
import { FactoryResourceLink } from "@/features/factory/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinFlowResourceLink } from "@/features/twin-flow/ui";
import { Badge, GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinFlowFactoryGeneral({
  twinflowFactory,
  onUpdate,
}: {
  twinflowFactory: TwinFlowFactory_DETAILED;
  onUpdate?: () => Promise<void>;
}) {
  const { updateTwinFlowFactory } = useUpdateTwinFlowFactory();
  const launcherAdapter = useFactoryLauncherSelectAdapter();
  const twinflowAdapter = useTwinFlowSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();

  async function update(updateData: any) {
    try {
      await updateTwinFlowFactory({
        body: {
          twinflowFactories: [
            {
              id: twinflowFactory.id,
              ...updateData,
            },
          ],
        },
      });
      await onUpdate?.();
      toast.success("Twinflow factory updated successfully");
    } catch (error) {
      toast.error("Twinflow factory update failed");
      console.error(error);
    }
  }

  const twinflowSettings: InPlaceEditProps<typeof twinflowFactory.twinflowId> =
    {
      id: "twinflowId",
      value: twinflowFactory.twinflowId,
      valueInfo: {
        type: AutoFormValueType.combobox,
        selectPlaceholder: "Select twinflow...",
        ...twinflowAdapter,
      },
      renderPreview: twinflowFactory.twinflow
        ? () => (
            <TwinFlowResourceLink
              data={twinflowFactory.twinflow!}
              withTooltip
            />
          )
        : undefined,
      onSubmit: async (value) => {
        const twinflowId = (value as unknown as Array<{ id: string }>)[0]?.id;
        return update({ twinflowId });
      },
    };

  const launcherSettings: InPlaceEditProps<
    typeof twinflowFactory.twinFactoryLauncherId
  > = {
    id: "twinFactoryLauncherId",
    value: twinflowFactory.twinFactoryLauncherId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select launcher...",
      ...launcherAdapter,
    },
    renderPreview: twinflowFactory.twinFactoryLauncherId
      ? () => (
          <Badge variant="outline">
            {twinflowFactory.twinFactoryLauncherId}
          </Badge>
        )
      : undefined,
    onSubmit: async (value) => {
      const launcherId = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ twinFactoryLauncherId: launcherId });
    },
  };

  const factorySettings: InPlaceEditProps<typeof twinflowFactory.factoryId> = {
    id: "factoryId",
    value: twinflowFactory.factoryId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select factory...",
      ...factoryAdapter,
    },
    renderPreview: twinflowFactory.factory
      ? () => (
          <FactoryResourceLink data={twinflowFactory.factory!} withTooltip />
        )
      : undefined,
    onSubmit: async (value) => {
      const factoryId = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ factoryId });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinflowFactory.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twinflow</TableCell>
            <TableCell>
              <InPlaceEdit {...twinflowSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Launcher</TableCell>
            <TableCell>
              <InPlaceEdit {...launcherSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Factory</TableCell>
            <TableCell>
              <InPlaceEdit {...factorySettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
