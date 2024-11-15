import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { ColorPicker } from "@/components/base/color-picker";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { Table, TableBody, TableCell, TableRow } from "@/components/base/table";
import {
  TwinClassStatus,
  TwinClassStatusResourceLink,
  TwinClassStatusUpdateRq,
} from "@/entities/twinClassStatus";
import { ApiContext } from "@/shared/api";
import { useContext, useState } from "react";
import { TwinClassContext } from "../../twin-class-context";

export function TwinStatusGeneral({
  status,
  onChange,
}: {
  status: TwinClassStatus;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);
  const { twinClassId } = useContext(TwinClassContext);
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);

  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const [backgroundColor, setBackgroundColor] = useState(
    status.backgroundColor || "#FFFFFF"
  );
  const [fontColor, setFontColor] = useState(status.fontColor || "#FFFFFF");

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditStatusDialogOpen(true);
  }

  async function updateStatus(newStatus: TwinClassStatusUpdateRq) {
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

  const descriptionAutoDialogSettings: AutoEditDialogSettings = {
    value: { description: status.description },
    title: "Update description",
    onSubmit: (values) => {
      return updateStatus({
        descriptionI18n: { translationInCurrentLocale: values.description },
      });
    },
    valuesInfo: {
      description: {
        type: AutoFormValueType.string,
        label: "Description",
      },
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
            <TableCell>ID</TableCell>
            <TableCell>
              <ShortGuidWithCopy value={status.id} />
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

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(descriptionAutoDialogSettings)}
          >
            <TableCell>Description</TableCell>
            <TableCell>{status.description}</TableCell>
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
