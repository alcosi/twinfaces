import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { PermissionResourceLink } from "@/entities/permission";
import {
  TwinFlowTransition,
  TwinFlowTransitionUpdateRq,
} from "@/entities/twin-flow-transition";
import {
  TwinClassStatusResourceLink,
  TwinStatusV2,
  useTwinStatusSelectAdapter,
} from "@/entities/twin-status";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import { PrivateApiContext } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinflowTransitionGeneral({
  transition,
  onChange,
}: {
  transition: TwinFlowTransition;
  onChange: () => void;
}) {
  const api = useContext(PrivateApiContext);
  const sAdapter = useTwinStatusSelectAdapter();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  async function updateTransition(newTransition: TwinFlowTransitionUpdateRq) {
    try {
      await api.twinFlowTransition.update({
        transitionId: transition.id!,
        body: newTransition,
      });
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

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
      return updateTransition({
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
      return updateTransition({
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
      ? (_) => (
          <TwinClassStatusResourceLink
            data={transition.srcTwinStatus as TwinStatusV2}
            twinClassId={transition.srcTwinStatus?.twinClassId!}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      return updateTransition({ srcStatusId: value[0].id });
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
      ? (_) => (
          <TwinClassStatusResourceLink
            data={transition.dstTwinStatus as TwinStatusV2}
            twinClassId={transition.dstTwinStatus?.twinClassId!}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      return updateTransition({ dstStatusId: value[0].id });
    },
  };

  //  TODO: Replace with <PermissionSelectField />
  // as per https://alcosi.atlassian.net/browse/TWINFACES-116
  const permissionAutoDialogSettings: AutoEditDialogSettings = {
    value: { permissionId: transition.permissionId },
    title: "Update permission",
    onSubmit: (values) => {
      return updateTransition({
        permissionId: values.permissionId,
      });
    },
    valuesInfo: {
      permission: {
        type: AutoFormValueType.string,
        label: "Permission",
      },
      permissionId: {
        type: AutoFormValueType.string,
        label: "Permission",
      },
    },
  };

  return (
    <>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={transition.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Alias</TableCell>
            <TableCell>{transition.alias}</TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
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
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(permissionAutoDialogSettings)}
          >
            <TableCell>Permission</TableCell>
            <TableCell>
              {transition.permission && (
                <PermissionResourceLink data={transition.permission} />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(transition.createdAt!)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </>
  );
}
