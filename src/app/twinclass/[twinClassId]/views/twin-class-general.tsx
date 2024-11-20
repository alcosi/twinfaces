import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { FeaturerTypes } from "@/components/featurer-input";
import { DatalistResourceLink } from "@/entities/datalist";
import {
  DataListV1,
  TwinClass_DETAILED,
  TwinClassContext,
  TwinClassResourceLink,
  TwinClassUpdateRq,
  useFetchTwinClassById,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { ApiContext } from "@/shared/api";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";
import { z } from "zod";
import {
  InPlaceField,
  InPlaceFieldProps,
} from "@/features/inPlaceEdit/in-place-field";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit/in-place-edit-context";
import { useFetchDatalistById } from "@/entities/datalist/libs/hooks";
import { useDatalistSearch } from "@/entities/datalist/libs/hooks/useDatalistSearch";

export function TwinClassGeneral() {
  const api = useContext(ApiContext);
  const { twinClass, relatedObjects, fetchClassData } =
    useContext(TwinClassContext);
  const { searchTwinClasses } = useTwinClassSearchV1();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const { fetchTwinClassById } = useFetchTwinClassById();
  const { searchDatalist } = useDatalistSearch();
  const { fetchDatalistById } = useFetchDatalistById();

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

  async function fetchClasses(search: string) {
    const { data } = await searchTwinClasses({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: { nameI18nLikeList: ["%" + search + "%"] },
    });

    return data ?? [];
  }

  async function fetchDatalists(search: string) {
    const { data } = await searchDatalist({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: { nameLikeList: ["%" + search + "%"] },
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

  async function findDatalistById(id: string) {
    return (
      await fetchDatalistById({
        id,
        query: {
          showDataListMode: "DETAILED",
          showDataListOptionMode: "DETAILED",
        },
      })
    ).data?.dataList;
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

    marker: {
      value: {
        markersDataListId: twinClass.markersDataListId,
      },
      title: "Update markers",
      onSubmit: (values) => {
        return updateTwinClass({
          markerDataListUpdate: {
            newId: values.markerId,
            onUnreplacedStrategy: "delete",
          },
        });
      },
      valuesInfo: {
        markersDataListId: {
          type: AutoFormValueType.combobox,
          label: "Markers",
          getById: findDatalistById,
          getItems: fetchDatalists,
          getItemKey: (c) => c?.id?.toLowerCase() ?? "",
          selectPlaceholder: "Select markers...",
          getItemLabel: (c) => {
            return c?.name;
          },
        },
      },
    },

    tag: {
      value: {
        tagsDataListId:
          twinClass.tagsDataListId && relatedObjects?.dataListsMap
            ? relatedObjects.dataListsMap[twinClass.tagsDataListId]?.name
            : "Select markers...",
      },
      title: "Update tags",
      onSubmit: (values) => {
        return updateTwinClass({
          tagDataListUpdate: {
            newId: values.markerId,
            onUnreplacedStrategy: "delete",
          },
        });
      },
      valuesInfo: {
        tagsDataListId: {
          type: AutoFormValueType.combobox,
          label: "Tags",
          getById: findDatalistById,
          getItems: fetchDatalists,
          getItemKey: (c) => c?.id?.toLowerCase() ?? "",
          getItemLabel: (c) => {
            return c?.name;
          },
        },
      },
    },
  };

  const nameSettings: InPlaceFieldProps = {
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

  const descriptionSettings: InPlaceFieldProps = {
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

  const abstractSettings: InPlaceFieldProps = {
    id: "abstract",
    value: twinClass.abstractClass,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderView: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return updateTwinClass({
        abstractClass: value as boolean,
      });
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
              <ShortGuidWithCopy value={twinClass.id} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{twinClass.key}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceField {...nameSettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceField {...descriptionSettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Abstract</TableCell>
            <TableCell>
              <InPlaceField {...abstractSettings} />
            </TableCell>
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
            <TableCell
              className={"cursor-pointer"}
              onClick={() => openWithSettings(classValues.marker!)}
            >
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
            <TableCell
              className={"cursor-pointer"}
              onClick={() => openWithSettings(classValues.tag!)}
            >
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
            <TableCell>
              {new Date(twinClass.createdAt ?? "").toLocaleDateString()}
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
