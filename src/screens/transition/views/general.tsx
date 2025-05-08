import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { TwinFlow_DETAILED } from "@/entities/twin-flow";
import {
  TwinFlowTransitionUpdateRq,
  useTransitionAliasSelectAdapter,
  useUpdateTwinFlowTransition,
} from "@/entities/twin-flow-transition";
import {
  TwinStatusV2,
  useTwinStatusSelectAdapter,
} from "@/entities/twin-status";
import { FactoryResourceLink } from "@/features/factory/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { TwinFlowResourceLink } from "@/features/twin-flow/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { formatToTwinfaceDate, reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinflowTransitionGeneral() {
  const { transitionId, transition, refresh } = useContext(
    TwinFlowTransitionContext
  );
  const { updateTwinFlowTransition } = useUpdateTwinFlowTransition();
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();

  async function update(newTransition: TwinFlowTransitionUpdateRq) {
    try {
      await updateTwinFlowTransition({
        transitionId: transitionId,
        body: newTransition,
      });
      refresh();
    } catch {
      toast.error("Failed to update transition");
    }
  }

  //TODO https://alcosi.atlassian.net/browse/TWINFACES-269 add with possibility of new value enter
  const aliasSettings: InPlaceEditProps<typeof transition.alias> = {
    id: "alias",
    value: transition.alias,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select alias...",
      ...transitionAliasAdapter,
    },
    renderPreview: transition.alias ? (_) => transition.alias : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ alias: string }>)[0]?.alias;
      return update({ alias: id });
    },
  };

  const nameSettings: InPlaceEditProps<typeof transition.name> = {
    id: "name",
    value: transition.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        nameI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof transition.description> = {
    id: "description",
    value: transition.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        descriptionI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const srcTwinStatusSettings: InPlaceEditProps<
    typeof transition.srcTwinStatusId
  > = {
    id: "srcTwinStatusId",
    value: transition.srcTwinStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select status...",
      ...twinStatusAdapter,
      getItems: async (search) =>
        twinStatusAdapter.getItems(search, {
          twinClassIdMap: reduceToObject({
            list: toArray(transition.twinflow?.twinClassId),
            defaultValue: true,
          }),
        }),
    },
    renderPreview: transition.srcTwinStatus
      ? (_) => (
          <TwinClassStatusResourceLink
            data={transition.srcTwinStatus as TwinStatusV2}
            twinClassId={transition.srcTwinStatus?.twinClassId!}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ srcStatusId: id });
    },
  };

  const dstTwinStatusSettings: InPlaceEditProps<
    typeof transition.dstTwinStatusId
  > = {
    id: "dstTwinStatusId",
    value: transition.dstTwinStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select status...",
      ...twinStatusAdapter,
    },
    renderPreview: transition.dstTwinStatus
      ? (_) => (
          <TwinClassStatusResourceLink
            data={transition.dstTwinStatus as TwinStatusV2}
            twinClassId={transition.dstTwinStatus?.twinClassId!}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ dstStatusId: id });
    },
  };

  const permissionSettings: InPlaceEditProps<typeof transition.permissionId> = {
    id: "permissionId",
    value: transition.permissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...permissionAdapter,
    },
    renderPreview: transition.permission
      ? (_) => <PermissionResourceLink data={transition.permission!} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ permissionId: id });
    },
  };

  const factorySettings: InPlaceEditProps<
    typeof transition.inbuiltTwinFactoryId
  > = {
    id: "inbuiltTwinFactoryId",
    value: transition.inbuiltTwinFactoryId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select factory...",
      ...factoryAdapter,
    },
    renderPreview: transition.inbuiltTwinFactory
      ? (_) => (
          <FactoryResourceLink
            data={transition.inbuiltTwinFactory!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ inbuiltTwinFactoryId: id });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={transition.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twinflow</TableCell>
            <TableCell>
              {transition.twinflow && (
                <TwinFlowResourceLink
                  data={transition.twinflow as TwinFlow_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Alias</TableCell>
            <TableCell>
              <InPlaceEdit {...aliasSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Source status</TableCell>
            <TableCell>
              <InPlaceEdit {...srcTwinStatusSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Destination status</TableCell>
            <TableCell>
              <InPlaceEdit {...dstTwinStatusSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...permissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Factory</TableCell>
            <TableCell>
              <InPlaceEdit {...factorySettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(transition.createdAt)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
