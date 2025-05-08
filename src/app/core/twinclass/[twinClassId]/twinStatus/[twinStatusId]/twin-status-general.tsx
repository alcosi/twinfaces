import { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinStatusUpdateRq, useStatusUpdate } from "@/entities/twin-status";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinStatusContext } from "@/features/twin-status";
import {
  ColorPicker,
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TwinStatusGeneral() {
  const { twinStatusId, twinStatus, refresh } = useContext(TwinStatusContext);
  const { updateStatus } = useStatusUpdate();
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);

  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const [backgroundColor, setBackgroundColor] = useState(
    twinStatus.backgroundColor
  );
  const [fontColor, setFontColor] = useState(twinStatus.fontColor);

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditStatusDialogOpen(true);
  }

  async function update(newStatus: TwinStatusUpdateRq) {
    try {
      await updateStatus({ statusId: twinStatusId, body: newStatus });
      refresh?.();
    } catch {
      toast.error("Twin status update failed");
    }
  }

  const keySettings: InPlaceEditProps<typeof twinStatus.key> = {
    id: "key",
    value: twinStatus.key,
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
        key: value,
      });
    },
  };

  const nameSettings: InPlaceEditProps<typeof twinStatus.name> = {
    id: "name",
    value: twinStatus.name,
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
        nameI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof twinStatus.description> = {
    id: "description",
    value: twinStatus.description,
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

  const backgroundColorAutoDialogSettings: AutoEditDialogSettings = {
    value: { backgroundColor: twinStatus.backgroundColor },
    title: "Update background color",
    onSubmit: (values) => {
      setBackgroundColor(values.backgroundColor);

      return update({
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
    value: { fontColor: twinStatus.fontColor },
    title: "Update font Color",
    onSubmit: (values) => {
      setFontColor(values.fontColor);

      return update({
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
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinStatus.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {twinStatus.twinClass && (
                <TwinClassResourceLink
                  data={twinStatus.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>
              <InPlaceEdit {...keySettings} />
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
    </InPlaceEditContextProvider>
  );
}
