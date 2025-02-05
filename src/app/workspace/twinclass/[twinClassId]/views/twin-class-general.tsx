import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import {
  DataList,
  DatalistResourceLink,
  useDatalistSelectAdapter,
} from "@/entities/datalist";
import {
  Featurer_DETAILED,
  FeaturerResourceLink,
  FeaturerTypes,
} from "@/entities/featurer";
import {
  TwinClass_DETAILED,
  TwinClassContext,
  TwinClassResourceLink,
  TwinClassUpdateRq,
  useTwinClassSelectAdapter,
} from "@/entities/twinClass";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { ApiContext } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";
import { z } from "zod";
import {
  Permission,
  PermissionResourceLink,
  usePermissionSelectAdapter,
} from "@/entities/permission";

export function TwinClassGeneral() {
  const api = useContext(ApiContext);
  const { twinClass, fetchClassData } = useContext(TwinClassContext);
  const tcAdapter = useTwinClassSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const dlAdapter = useDatalistSelectAdapter();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  async function updateTwinClass(newClass: TwinClassUpdateRq) {
    if (!twinClass) {
      console.error("updateTwinClass: no twin class");
      return;
    }

    try {
      await api.twinClass.update({ id: twinClass.id!, body: newClass });
      fetchClassData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  if (!twinClass) {
    console.error("TwinClassGeneral: no twin class");
    return;
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
        return updateTwinClass({
          headTwinClassUpdate: { newId: values.headClassId },
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
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinClass({
        nameI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: twinClass.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinClass({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const abstractSettings: InPlaceEditProps = {
    id: "abstract",
    value: twinClass.abstractClass,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return updateTwinClass({
        abstractClass: value as boolean,
      });
    },
  };

  const viewPermissionSettings: InPlaceEditProps<any> = {
    id: "viewPermissionId",
    value: twinClass.viewPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: twinClass.viewPermission ? (_) => <PermissionResourceLink data={twinClass.viewPermission!} /> : undefined,
    onSubmit: async (value) => {
      return updateTwinClass({ viewPermissionId: value.viewPermissionId[0].id})
    },
  }

  const tagListSettings:  InPlaceEditProps<any> = {
    id: "tagsDataListId",
    value: twinClass.tagMap && [{name: twinClass.tagMap.name, key: twinClass.tagMap.key}],
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select tag...",
      ...dlAdapter,
    },
    renderPreview: twinClass.tagMap ? (_) => <DatalistResourceLink data={twinClass.tagMap as DataList} /> : undefined,
    onSubmit: async (value) => {
      return updateTwinClass({ tagDataListUpdate: { newId: value.tagsDataListId.id } })
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
              <InPlaceEdit {...abstractSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className={"cursor-pointer"}
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
            className={"cursor-pointer"}
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
              {twinClass.markerMap && (
                <DatalistResourceLink
                  data={twinClass.markerMap as DataList}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className={"cursor-pointer"}
          >
            <TableCell>Tags list</TableCell>
            <TableCell>
              <InPlaceEdit {...tagListSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className={"cursor-pointer"}
          >
            <TableCell>View Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...viewPermissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(twinClass.createdAt!)}</TableCell>
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
