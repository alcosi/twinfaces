import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { TwinClassContext } from "@/entities/twinClass";
import { TwinFlow, TwinFlowUpdateRq } from "@/entities/twinFlow";
import { ApiContext } from "@/shared/api";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";

export function TwinflowGeneral({
  twinflow,
  onChange,
}: {
  twinflow: TwinFlow;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);
  const { getStatusesBySearch, findStatusById } = useContext(TwinClassContext);
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

  const nameAutoDialogSettings: AutoEditDialogSettings = {
    value: { name: twinflow.name },
    title: "Update name",
    onSubmit: (values) => {
      return updateTwinFlow({
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
    value: { description: twinflow.description },
    title: "Update description",
    onSubmit: (values) => {
      return updateTwinFlow({
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
        getItems: getStatusesBySearch,
        getItemKey: (c) => c?.id?.toLowerCase() ?? "",
        getItemLabel: (c) => {
          let label = c?.key ?? "";
          if (c.name) label += ` (${c.name})`;
          return label;
        },
        getById: findStatusById,
        selectPlaceholder: "Select status...",
      },
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>{twinflow.id}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(nameAutoDialogSettings)}
          >
            <TableCell>Name</TableCell>
            <TableCell>{twinflow.name}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(descriptionAutoDialogSettings)}
          >
            <TableCell>Description</TableCell>
            <TableCell>{twinflow.description}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(initialStatusIdAutoDialogSettings)}
          >
            <TableCell>Initial status</TableCell>
            <TableCell>
              {twinflow.initialStatus?.name ?? twinflow.initialStatus?.key}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{twinflow.createdAt}</TableCell>
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
