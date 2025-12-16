import { useContext, useState } from "react";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import {
  FeaturerTypes,
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import { ProjectionType, useUpdateProjection } from "@/entities/projection";
import { useProjectionTypeSelectAdapter } from "@/entities/projection/libs";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { ProjectionContext } from "@/features/projection";
import { ProjectionTypeResourceLink } from "@/features/projection-type/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

import { TwinClass_DETAILED } from "../../../entities/twin-class/api/types";

export function ProjectionGeneral() {
  const { projection, refresh } = useContext(ProjectionContext);
  const { updateProjection } = useUpdateProjection();
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(44);

  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});

  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();

  const [editFieldDialogOpen, setEditFieldDialogOpen] =
    useState<boolean>(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const projectionTypeSettings: InPlaceEditProps<
    typeof projection.projectionTypeId
  > = {
    id: "projectionTypeId",
    value: projection.projectionTypeId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select projection type...",
      ...projectionTypeAdapter,
    },
    renderPreview: projection.projectionType
      ? () => (
          <ProjectionTypeResourceLink
            data={projection.projectionType as ProjectionType}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateProjection({
        body: {
          projectionList: [
            {
              projectionTypeId: id,
              id: projection.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const dstTwinClassSettings: InPlaceEditProps<
    typeof projection.dstTwinClassId
  > = {
    id: "dstTwinClassId",
    value: projection.dstTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select dst twin class...",
      ...twinClassAdapter,
    },
    renderPreview: projection.dstTwinClass
      ? () => (
          <TwinClassResourceLink
            data={projection.dstTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateProjection({
        body: {
          projectionList: [
            {
              dstTwinClassId: id,
              id: projection.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const fieldProjectorFeaturerSettings: AutoEditDialogSettings = {
    value: {
      fieldProjectorFeaturerId: projection.fieldProjectorFeaturerId,
    },
    title: "Update projector",
    onSubmit: (values) => {
      return updateProjection({
        body: {
          projectionList: [
            {
              fieldProjectorFeaturerId: values.fieldProjectorFeaturerId[0].id,
              fieldProjectorParams: values.fieldProjectorParams,
              id: projection.id,
            },
          ],
        },
      }).then(refresh);
    },
    valuesInfo: {
      fieldProjectorFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Projector",
        typeId: FeaturerTypes.projector,
        paramsFieldName: "fieldProjectorParams",
        ...featurerAdapter,
      },
    },
  };

  const srcTwinClassFieldDialogSettings: AutoEditDialogSettings = {
    title: "Update source twin class field",

    value: {
      srcTwinClassFieldId: projection.srcTwinClassFieldId,
    },

    valuesInfo: {
      srcTwinClassFieldId: {
        type: AutoFormValueType.complexCombobox,
        label: "Src twin class field",
        adapter: twinClassFieldAdapter,
        extraFilters: buildTwinClassFieldFilters(),
        mapExtraFilters: mapTwinClassFieldFilters,
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
      },
    },

    onSubmit: async (values) => {
      const id = values.srcTwinClassFieldId?.[0]?.id;

      return updateProjection({
        body: {
          projectionList: [
            {
              id: projection.id,
              srcTwinClassFieldId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const dstTwinClassFieldDialogSettings: AutoEditDialogSettings = {
    title: "Update destination twin class field",

    value: {
      dstTwinClassFieldId: projection.dstTwinClassFieldId,
    },

    valuesInfo: {
      dstTwinClassFieldId: {
        type: AutoFormValueType.complexCombobox,
        label: "Dst twin class field",
        adapter: twinClassFieldAdapter,
        extraFilters: buildTwinClassFieldFilters(),
        mapExtraFilters: mapTwinClassFieldFilters,
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
      },
    },

    onSubmit: async (values) => {
      const id = values.dstTwinClassFieldId?.[0]?.id;

      return updateProjection({
        body: {
          projectionList: [
            {
              id: projection.id,
              dstTwinClassFieldId: id,
            },
          ],
        },
      }).then(refresh);
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
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={projection.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>
              <InPlaceEdit {...projectionTypeSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(srcTwinClassFieldDialogSettings)}
          >
            <TableCell>Src field</TableCell>
            <TableCell>
              {projection.srcTwinClassField && (
                <TwinClassFieldResourceLink
                  data={projection.srcTwinClassField}
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Dst class</TableCell>
            <TableCell>
              <InPlaceEdit {...dstTwinClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(dstTwinClassFieldDialogSettings)}
          >
            <TableCell>Dst field</TableCell>
            <TableCell>
              {projection.dstTwinClassField && (
                <TwinClassFieldResourceLink
                  data={projection.dstTwinClassField}
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(fieldProjectorFeaturerSettings)}
          >
            <TableCell>Projector</TableCell>
            <TableCell>
              {projection.fieldProjectorFeaturer && (
                <FeaturerResourceLink
                  data={projection.fieldProjectorFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              )}
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
