import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { ClassStatusView } from "@/components/class-status-view";
import { PermissionResourceLink } from "@/entities/permission";
import { TwinClassContext } from "@/entities/twinClass";
import {
  TwinFlowTransition,
  TwinFlowTransitionUpdateRq,
} from "@/entities/twinFlowTransition";
import { ApiContext } from "@/shared/api";
import { NULLIFY_UUID_VALUE } from "@/shared/libs";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";

export function TwinflowTransitionGeneral({
  transition,
  onChange,
}: {
  transition: TwinFlowTransition;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);
  const { getStatusesBySearch, findStatusById } = useContext(TwinClassContext);
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
      console.log("updated");
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const nameAutoDialogSettings: AutoEditDialogSettings = {
    value: { name: transition.name },
    title: "Update name",
    onSubmit: (values) => {
      return updateTransition({
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
    value: { description: transition.description },
    title: "Update description",
    onSubmit: (values) => {
      return updateTransition({
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

  const statusIdAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      srcTwinStatusId: transition.srcTwinStatusId,
      dstTwinStatusId: transition.dstTwinStatusId,
    },
    title: "Update statuses",
    onSubmit: (values) => {
      return updateTransition({
        srcStatusId: values.srcTwinStatusId ?? NULLIFY_UUID_VALUE,
        dstStatusId: values.dstTwinStatusId ?? NULLIFY_UUID_VALUE,
      });
    },
    valuesInfo: {
      srcTwinStatusId: {
        type: AutoFormValueType.combobox,
        label: "Source status",
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
      dstTwinStatusId: {
        type: AutoFormValueType.combobox,
        label: "Destination status",
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
            <TableCell>ID</TableCell>
            <TableCell>{transition.id}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(nameAutoDialogSettings)}
          >
            <TableCell>Name</TableCell>
            <TableCell>{transition.name}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(descriptionAutoDialogSettings)}
          >
            <TableCell>Description</TableCell>
            <TableCell>{transition.description}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(statusIdAutoDialogSettings)}
          >
            <TableCell>Source status</TableCell>
            <TableCell>
              <ClassStatusView status={transition.srcTwinStatus} />
            </TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(statusIdAutoDialogSettings)}
          >
            <TableCell>Destination status</TableCell>
            <TableCell>
              <ClassStatusView status={transition.dstTwinStatus} />
            </TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(permissionAutoDialogSettings)}
          >
            <TableCell>Permission</TableCell>
            <TableCell>
              {transition.permission ? (
                <PermissionResourceLink data={transition.permission} />
              ) : (
                "N/A"
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{transition.createdAt}</TableCell>
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
