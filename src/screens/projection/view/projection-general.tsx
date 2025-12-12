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
  TwinClassField_DETAILED,
  useTwinClassFieldSelectAdapter,
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
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(44);

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
      ? (_) => (
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

  const srcTwinClassFieldSettings: InPlaceEditProps<
    typeof projection.srcTwinClassFieldId
  > = {
    id: "srcTwinClassFieldId",
    value: projection.srcTwinClassFieldId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select src twin class field...",
      ...twinClassFieldAdapter,
    },
    renderPreview: projection.srcTwinClassField
      ? (_) => (
          <TwinClassFieldResourceLink
            data={projection.srcTwinClassField as TwinClassField_DETAILED}
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
              srcTwinClassFieldId: id,
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
      ? (_) => (
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

  const dstTwinClassFieldSettings: InPlaceEditProps<
    typeof projection.dstTwinClassFieldId
  > = {
    id: "dstTwinClassFieldId",
    value: projection.dstTwinClassFieldId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select dst twin class field...",
      ...twinClassFieldAdapter,
    },
    renderPreview: projection.dstTwinClassField
      ? (_) => (
          <TwinClassFieldResourceLink
            data={projection.dstTwinClassField as TwinClassField_DETAILED}
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
              dstTwinClassFieldId: id,
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

          <TableRow>
            <TableCell>Src field</TableCell>
            <TableCell>
              <InPlaceEdit {...srcTwinClassFieldSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Dst class</TableCell>
            <TableCell>
              <InPlaceEdit {...dstTwinClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Dst field</TableCell>
            <TableCell>
              <InPlaceEdit {...dstTwinClassFieldSettings} />
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
