import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { TwinClassContext } from "@/entities/twinClass";
import {
  TwinClassStatusResourceLink,
  TwinStatus,
  TwinStatusUpdateRq,
} from "@/entities/twinStatus";
import { ApiContext } from "@/shared/api";
import { ColorPicker } from "@/shared/ui/color-picker";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import { z } from "zod";

export function TwinStatusGeneral({
  status,
  onChange,
}: {
  status: TwinStatus;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);
  const { twinClassId } = useContext(TwinClassContext);
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);

  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const [backgroundColor, setBackgroundColor] = useState(
    status.backgroundColor
  );
  const [fontColor, setFontColor] = useState(status.fontColor);

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditStatusDialogOpen(true);
  }

  async function updateStatus(newStatus: TwinStatusUpdateRq) {
    try {
      await api.twinStatus.update({ statusId: status.id!, data: newStatus });
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const nameAutoDialogSettings: AutoEditDialogSettings = {
    value: { name: status.name },
    title: "Update name",
    onSubmit: (values) => {
      return updateStatus({
        nameI18n: { translationInCurrentLocale: values.name },
      });
    },
    valuesInfo: {
      name: {
        type: AutoFormValueType.string,
        label: "Name",
      },
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: status.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateStatus({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const backgroundColorAutoDialogSettings: AutoEditDialogSettings = {
    value: { backgroundColor: status.backgroundColor },
    title: "Update background color",
    onSubmit: (values) => {
      setBackgroundColor(values.backgroundColor);

      return updateStatus({
        backgroundColor: values.backgroundColor,
      });
    },
    valuesInfo: {
      backgroundColor: {
        type: AutoFormValueType.color,
        label: "Background Color",
      },
    },
  };

  const fontColorAutoDialogSettings: AutoEditDialogSettings = {
    value: { fontColor: status.fontColor },
    title: "Update font Color",
    onSubmit: (values) => {
      setFontColor(values.fontColor);

      return updateStatus({
        fontColor: values.fontColor,
      });
    },
    valuesInfo: {
      fontColor: {
        type: AutoFormValueType.color,
        label: "Font Color",
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
              <GuidWithCopy value={status.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{status.key}</TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(nameAutoDialogSettings)}
          >
            <TableCell>Name</TableCell>
            <TableCell>
              <TwinClassStatusResourceLink
                data={status}
                twinClassId={twinClassId}
              />
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(backgroundColorAutoDialogSettings)}
          >
            <TableCell>Background Color</TableCell>
            <TableCell>
              <ColorPicker value={backgroundColor} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(fontColorAutoDialogSettings)}
          >
            <TableCell>Font Color</TableCell>
            <TableCell>
              <ColorPicker value={fontColor} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editStatusDialogOpen}
        onOpenChange={setEditStatusDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </>
  );
}
