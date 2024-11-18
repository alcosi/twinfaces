import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { Table, TableBody, TableCell, TableRow } from "@/components/base/table";
import { FeaturerTypes } from "@/components/featurer-input";
import {
  DataListV1,
  TwinClass_DETAILED,
  TwinClassResourceLink,
  TwinClassUpdateRq,
  useFetchTwinClassById,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { ApiContext } from "@/shared/api";
import { useContext, useState } from "react";
import { z } from "zod";
import { DatalistResourceLink } from "@/entities/datalist";

export function TwinClassGeneral() {
  const api = useContext(ApiContext);
  const { twinClass, relatedObjects, fetchClassData } =
    useContext(TwinClassContext);
  const { searchTwinClasses } = useTwinClassSearchV1();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const { fetchTwinClassById } = useFetchTwinClassById();

  async function updateTwinClass(newClass: TwinClassUpdateRq) {
    if (!twinClass) {
      console.error("updateTwinClass: no twin class");
      return;
    }

    try {
      await api.twinClass.update({ id: twinClass.id!, body: newClass });
      console.log("updated");
      fetchClassData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async function fetchClasses(search: string) {
    const { data } = await searchTwinClasses({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: { filters: { nameI18nLikeList: ["%" + search + "%"] } },
    });

    return data ?? [];
  }

  async function findById(id: string) {
    return (
      await fetchTwinClassById({
        id,
        query: {
          showTwinClassMode: "DETAILED",
          showTwin2TwinClassMode: "SHORT",
        },
      })
    ).data?.twinClass;
  }

  if (!twinClass) {
    console.error("TwinClassGeneral: no twin class");
    return;
  }

  const classValues: { [key: string]: AutoEditDialogSettings } = {
    // key: {
    //     name: "Key",
    //     value: {"key": twinClass.key},
    //     title: 'Update key',
    //     onSubmit: (values) => {
    //         return updateTwinClass({key: values.key})
    //     },
    //     valuesInfo: {
    //         "key": {
    //             type: AutoFormValueType.uuid
    //         }
    //     }
    // },
    name: {
      value: { name: twinClass.name },
      title: "Update name",
      schema: z.object({ name: z.string().min(3) }),
      onSubmit: (values) => {
        return updateTwinClass({
          nameI18n: { translationInCurrentLocale: values.name },
        });
      },
      valuesInfo: {
        name: {
          type: AutoFormValueType.string,
          label: "Name",
        },
      },
    },
    description: {
      value: { description: twinClass.description },
      title: "Update description",
      onSubmit: (values) => {
        return updateTwinClass({
          descriptionI18n: { translationInCurrentLocale: values.description },
        });
      },
      valuesInfo: {
        description: {
          type: AutoFormValueType.string,
          label: "Description",
        },
      },
    },
    abstractClass: {
      value: { abstractClass: twinClass.abstractClass },
      title: "Update abstract",
      onSubmit: (values) => {
        return updateTwinClass({ abstractClass: values.abstractClass });
      },
      valuesInfo: {
        abstractClass: {
          type: AutoFormValueType.boolean,
          label: "Abstract",
        },
      },
    },
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
          getById: findById,
          getItems: fetchClasses,
          getItemKey: (c) => c?.id?.toLowerCase() ?? "",
          getItemLabel: (c) => {
            let label = c?.key ?? "";
            if (c.name) label += ` (${c.name})`;
            return label;
          },
        },
        headHunterFeaturerId: {
          type: AutoFormValueType.featurer,
          label: "Head hunter featurer",
          paramsName: "headHunterParams",
          typeId: FeaturerTypes.headHunter,
        },
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
            <TableCell>
              <ShortGuidWithCopy value={twinClass.id} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{twinClass.key}</TableCell>
          </TableRow>
          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(classValues.name!)}
          >
            <TableCell>Name</TableCell>
            <TableCell>{twinClass.name}</TableCell>
          </TableRow>
          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(classValues.description!)}
          >
            <TableCell>Description</TableCell>
            <TableCell>{twinClass.description}</TableCell>
          </TableRow>
          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(classValues.abstractClass!)}
          >
            <TableCell>Abstract</TableCell>
            <TableCell>{twinClass.abstractClass ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(classValues.head!)}
          >
            <TableCell>Head</TableCell>
            <TableCell>
              {twinClass.headClassId && relatedObjects?.twinClassMap && (
                <TwinClassResourceLink
                  data={
                    relatedObjects.twinClassMap[
                      twinClass.headClassId
                    ] as TwinClass_DETAILED
                  }
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(classValues.head!)}
          >
            <TableCell>Head Hunter ID</TableCell>
            <TableCell>{twinClass.headHunterFeaturerId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Extends</TableCell>
            <TableCell>
              {twinClass.extendsClassId && relatedObjects?.twinClassMap && (
                <TwinClassResourceLink
                  data={
                    relatedObjects.twinClassMap[
                      twinClass.extendsClassId
                    ] as TwinClass_DETAILED
                  }
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Markers</TableCell>
            <TableCell>
              {twinClass.markersDataListId && relatedObjects?.dataListsMap && (
                <DatalistResourceLink
                  data={
                    relatedObjects.dataListsMap[
                      twinClass.markersDataListId
                    ] as DataListV1
                  }
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Tags</TableCell>
            <TableCell>
              {twinClass.tagsDataListId && relatedObjects?.dataListsMap && (
                <DatalistResourceLink
                  data={
                    relatedObjects.dataListsMap[
                      twinClass.tagsDataListId
                    ] as DataListV1
                  }
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{twinClass.createdAt}</TableCell>
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
