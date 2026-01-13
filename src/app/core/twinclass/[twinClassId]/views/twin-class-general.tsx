import { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { DataList, useDatalistSelectAdapter } from "@/entities/datalist";
import { FeaturerTypes, Featurer_DETAILED } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  TwinClassContext,
  TwinClassUpdateRq,
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
  useUpdateTwinClass,
} from "@/entities/twin-class";
import { useTwinClassFreezeSelectAdapter } from "@/entities/twin-class-freeze";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFreezeResourceLink } from "@/features/twin-class-freeze/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { formatIntlDate, isPopulatedString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinClassGeneral() {
  const { twinClass, refresh } = useContext(TwinClassContext);
  const { updateTwinClass } = useUpdateTwinClass();
  const tcAdapter = useTwinClassSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const dlAdapter = useDatalistSelectAdapter();
  const fAdapter = useTwinClassFreezeSelectAdapter();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const { confirm } = useActionDialogs();

  async function update(newClass: TwinClassUpdateRq) {
    try {
      await updateTwinClass({
        twinClassId: twinClass.id!,
        body: newClass,
      });
      refresh();
    } catch {
      toast.error("TwinClass Update Failed");
    }
  }

  const classValues: { [key: string]: AutoEditDialogSettings } = {
    head: {
      value: {
        headClassId: twinClass.headClassId,
        headHunterFeaturerId: twinClass.headHunterFeaturerId,
        headHunterParams: twinClass.headHunterParams,
      },
      title: "Update head",
      onSubmit: (values) => {
        return update({
          headTwinClassUpdate: { newId: values.headClassId[0].id },
          headHunterFeaturerId: values.headHunterFeaturerId,
          headHunterParams: values.headHunterParams,
        });
      },
      valuesInfo: {
        headClassId: {
          type: AutoFormValueType.combobox,
          label: "Head class",
          ...tcAdapter,
        },
        headHunterFeaturerId: {
          type: AutoFormValueType.featurer,
          label: "Head hunter featurer",
          typeId: FeaturerTypes.headHunter,
          paramsFieldName: "headHunterFeaturerParams",
        },
      },
    },
  };

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: twinClass.name,
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
        nameI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: twinClass.description,
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
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const createPermissionSettings: InPlaceEditProps<
    typeof twinClass.createPermissionId
  > = {
    id: "createPermissionId",
    value: twinClass.createPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: twinClass.createPermission
      ? () => <PermissionResourceLink data={twinClass.createPermission!} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ createPermissionId: id });
    },
  };

  const viewPermissionSettings: InPlaceEditProps<
    typeof twinClass.viewPermissionId
  > = {
    id: "viewPermissionId",
    value: twinClass.viewPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: twinClass.viewPermission
      ? () => <PermissionResourceLink data={twinClass.viewPermission!} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ viewPermissionId: id });
    },
  };

  const editPermissionSettings: InPlaceEditProps<
    typeof twinClass.editPermissionId
  > = {
    id: "editPermissionId",
    value: twinClass.editPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: twinClass.editPermission
      ? () => <PermissionResourceLink data={twinClass.editPermission!} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ editPermissionId: id });
    },
  };

  const deletePermissionSettings: InPlaceEditProps<
    typeof twinClass.deletePermissionId
  > = {
    id: "deletePermissionId",
    value: twinClass.deletePermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: twinClass.deletePermission
      ? () => <PermissionResourceLink data={twinClass.deletePermission!} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ deletePermissionId: id });
    },
  };

  const externalIdSettings: InPlaceEditProps = {
    id: "externalId",
    value: twinClass.externalId,
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
        externalId: value as string,
      });
    },
  };

  const freezeSettings: InPlaceEditProps<typeof twinClass.twinClassFreezeId> = {
    id: "twinClassFreezeId",
    value: twinClass.twinClassFreezeId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select freeze...",
      ...fAdapter,
    },
    renderPreview: twinClass.twinClassFreeze
      ? () => (
          <TwinClassFreezeResourceLink
            data={twinClass.twinClassFreeze! as TwinClass_DETAILED}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ twinClassFreezeId: id });
    },
  };

  const tagListSettings: InPlaceEditProps<any> = {
    id: "tagsDataListId",
    value: twinClass.tagMap
      ? [{ name: twinClass.tagMap.name, key: twinClass.tagMap.key }]
      : undefined,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select tag...",
      ...dlAdapter,
    },
    renderPreview: twinClass.tagMap
      ? () => <DatalistResourceLink data={twinClass.tagMap as DataList} />
      : undefined,
    onSubmit: async (value) => {
      return update({ tagDataListUpdate: { newId: value[0].id } });
    },
  };

  const markerListSettings: InPlaceEditProps<any> = {
    id: "markersDataListId",
    value: twinClass.markerMap
      ? [{ name: twinClass.markerMap.name, key: twinClass.markerMap.key }]
      : undefined,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select marker...",
      ...dlAdapter,
    },
    renderPreview: twinClass.markerMap
      ? () => <DatalistResourceLink data={twinClass.markerMap as DataList} />
      : undefined,
    onSubmit: async (value) => {
      return update({ markerDataListUpdate: { newId: value[0].id } });
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  function switchAbstract() {
    const action = twinClass.abstractClass ? "disable" : "enable";
    const status = twinClass.abstractClass ? "Disable" : "Enable";

    confirm({
      title: `${status} Abstract Mode`,
      body: `Are you sure you want to ${action} abstract mode for this class?`,
      onSuccess: () => {
        return update({
          abstractClass: !twinClass.abstractClass,
        });
      },
    });
  }

  function switchAssigneeRequired() {
    const action = twinClass.assigneeRequired ? "disable" : "enable";
    const status = twinClass.assigneeRequired ? "Disable" : "Enable";

    confirm({
      title: `${status} Assignee required Mode`,
      body: `Are you sure you want to ${action} assignee required mode for this class?`,
      onSuccess: () => {
        return update({
          assigneeRequired: !twinClass.assigneeRequired,
        });
      },
    });
  }

  function switchSegment() {
    const action = twinClass.segment ? "disable" : "enable";
    const status = twinClass.segment ? "Disable" : "Enable";

    confirm({
      title: `${status} Segment Mode`,
      body: `Are you sure you want to ${action} segment mode for this class?`,
      onSuccess: () => {
        return update({
          segment: !twinClass.segment,
        });
      },
    });
  }

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinClass.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{twinClass.key}</TableCell>
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
            <TableCell>Abstract</TableCell>
            <TableCell>
              <Switch
                checked={twinClass.abstractClass ?? false}
                onCheckedChange={switchAbstract}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Assignee required</TableCell>
            <TableCell>
              <Switch
                checked={twinClass.assigneeRequired ?? false}
                onCheckedChange={switchAssigneeRequired}
              />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(classValues.head!)}
          >
            <TableCell>Head</TableCell>
            <TableCell>
              {twinClass.headClass && (
                <TwinClassResourceLink
                  data={twinClass.headClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(classValues.head!)}
          >
            <TableCell>Head hunter</TableCell>
            <TableCell>
              {twinClass.headHunterFeaturer && (
                <FeaturerResourceLink
                  data={twinClass.headHunterFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Extends</TableCell>
            <TableCell>
              {twinClass.extendsClass && (
                <TwinClassResourceLink
                  data={twinClass.extendsClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Markers list</TableCell>
            <TableCell>
              <InPlaceEdit {...markerListSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Tags list</TableCell>
            <TableCell>
              <InPlaceEdit {...tagListSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Create Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...createPermissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>View Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...viewPermissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Edit Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...editPermissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Delete Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...deletePermissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>External Id</TableCell>
            <TableCell>
              <InPlaceEdit {...externalIdSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Segment</TableCell>
            <TableCell>
              <Switch
                checked={twinClass.segment ?? false}
                onCheckedChange={switchSegment}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Has segment</TableCell>
            <TableCell>{twinClass.hasSegment ? "Yes" : "No"}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Freeze</TableCell>
            <TableCell>
              <InPlaceEdit {...freezeSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {isPopulatedString(twinClass.createdAt) &&
                formatIntlDate(twinClass.createdAt, "datetime-local")}
            </TableCell>
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
