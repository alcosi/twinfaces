import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { ClassStatusView } from "@/components/class-status-view";

import { PermissionResourceLink } from "@/entities/permission";
import {
  PermissionResourceLink,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import {
  TwinFlowTransition,
  TwinFlowTransitionUpdateRq,
  useUpdateTransition,
} from "@/entities/twin-flow-transition";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import { PrivateApiContext } from "@/shared/api";
import { NULLIFY_UUID_VALUE, formatToTwinfaceDate } from "@/shared/libs";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { z } from "zod";
import { TwinFlow_DETAILED, TwinFlowResourceLink } from "@/entities/twin-flow";
import {
  FactoryResourceLink,
  useFactorySelectAdapter,
} from "@/entities/factory";
import { useTransitionAliasSelectAdapter } from "@/entities/transition-alias";
import { toast } from "sonner";

export function TwinflowTransitionGeneral({
  transition,
  onChange,
}: {
  transition: TwinFlowTransition;
  onChange: () => any;
}) {
  const api = useContext(PrivateApiContext);
  const sAdapter = useTwinStatusSelectAdapter();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const { updateTransition } = useUpdateTransition();
  const sAdapter = useTwinStatusSelectAdapter(transition.twinflow?.twinClassId);
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFactorySelectAdapter();
  const tAAdapter = useTransitionAliasSelectAdapter();

  async function update(newTransition: TwinFlowTransitionUpdateRq) {
    try {
      await updateTransition({
        transitionId: transition.id!,
        body: newTransition,
      });
      onChange?.();
    } catch {
      toast.error("not updated transition");
    }
  }

  //TODO https://alcosi.atlassian.net/browse/TWINFACES-269 add with possibility of new value enter
  const aliasSettings: InPlaceEditProps<any> = {
    id: "alias",
    value: transition.alias,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select alias...",
      ...tAAdapter,
    },
    renderPreview: transition.alias ? (_) => transition.alias : undefined,
    onSubmit: async (value) => {
      return update({ alias: value[0].alias });
    },
  };

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: transition.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        nameI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: transition.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const srcTwinStatusSettings: InPlaceEditProps<any> = {
    id: "srcTwinStatusId",
    value: transition.srcTwinStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select status...",
      ...sAdapter,
    },
    renderPreview: transition.srcTwinStatus
      ? (_) => <ClassStatusView status={transition.srcTwinStatus} />
      : undefined,
    onSubmit: async (value) => {
      return update({ srcStatusId: value[0].id });
    },
  };

  const dstTwinStatusSettings: InPlaceEditProps<any> = {
    id: "dstTwinStatusId",
    value: transition.dstTwinStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select status...",
      ...sAdapter,
    },
    renderPreview: transition.dstTwinStatus
      ? (_) => <ClassStatusView status={transition.dstTwinStatus} />
      : undefined,
    onSubmit: async (value) => {
      return update({ dstStatusId: value[0].id });
    },
  };

  const permissionSettings: InPlaceEditProps<any> = {
    id: "permissionId",
    value: transition.permissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: transition.permission
      ? (_) => <PermissionResourceLink data={transition.permission!} />
      : undefined,
    onSubmit: async (value) => {
      return update({ permissionId: value[0].id });
    },
  };

  const factorySettings: InPlaceEditProps<any> = {
    id: "inbuiltTwinFactoryId",
    value: transition.inbuiltTwinFactoryId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select factory...",
      ...fAdapter,
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
      return update({ inbuiltTwinFactoryId: value[0].id });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
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
            <TableCell>{formatToTwinfaceDate(transition.createdAt!)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
