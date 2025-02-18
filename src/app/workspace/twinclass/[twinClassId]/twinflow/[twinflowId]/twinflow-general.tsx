import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twin-class";
import { TwinFlow, TwinFlowUpdateRq } from "@/entities/twinFlow";
import {
  TwinClassStatusResourceLink,
  TwinStatus,
  useTwinStatusSelectAdapter,
} from "@/entities/twin-status";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { ApiContext } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";
import { z } from "zod";

export function TwinflowGeneral({
  twinflow,
  onChange,
}: {
  twinflow: TwinFlow;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);
  const sAdapter = useTwinStatusSelectAdapter();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  async function updateTwinFlow(newFlow: TwinFlowUpdateRq) {
    try {
      await api.twinFlow.update({ id: twinflow.id!, body: newFlow });
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: twinflow.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinFlow({
        nameI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: twinflow.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinFlow({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const initialStatusIdAutoDialogSettings: AutoEditDialogSettings = {
    value: { initialStatusId: twinflow.initialStatusId },
    title: "Update initial status",
    onSubmit: (values) => {
      return updateTwinFlow({ initialStatusId: values.initialStatusId });
    },
    valuesInfo: {
      initialStatusId: {
        type: AutoFormValueType.combobox,
        label: "Initial status",
        selectPlaceholder: "Select status...",
        ...sAdapter,
      },
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinflow.id} variant={"long"} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {twinflow.twinClass && (
                <TwinClassResourceLink
                  data={twinflow.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
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

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(initialStatusIdAutoDialogSettings)}
          >
            <TableCell>Initial status</TableCell>
            <TableCell>
              {twinflow.initialStatus && (
                <TwinClassStatusResourceLink
                  data={twinflow.initialStatus as TwinStatus}
                  twinClassId={twinflow.twinClassId!}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(twinflow.createdAt!)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </InPlaceEditContextProvider>
  );
}
