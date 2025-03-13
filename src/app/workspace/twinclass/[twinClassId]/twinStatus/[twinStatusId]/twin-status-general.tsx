import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import {
  TwinStatusUpdateRq,
  TwinStatusV2,
  useStatusUpdate,
} from "@/entities/twin-status";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { ColorPicker } from "@/shared/ui/color-picker";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinStatusGeneral({
  status,
  onChange,
}: {
  status: TwinStatusV2;
  onChange: () => any;
}) {
  const { updateStatus } = useStatusUpdate();
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

  async function update(newStatus: TwinStatusUpdateRq) {
    try {
      await updateStatus({ statusId: status.id!, body: newStatus });
      onChange?.();
    } catch {
      toast.error("Twin status update failed");
    }
  }

  const keySettings: InPlaceEditProps = {
    id: "key",
    value: status.key,
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
        key: value as string,
      });
    },
  };

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: status.name,
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
        nameI18n: { translationInCurrentLocale: value as string },
      });
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
      return update({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const backgroundColorAutoDialogSettings: AutoEditDialogSettings = {
    value: { backgroundColor: status.backgroundColor },
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
    value: { fontColor: status.fontColor },
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
              <GuidWithCopy value={status.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {status.twinClass && (
                <TwinClassResourceLink
                  data={status.twinClass as TwinClass_DETAILED}
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
