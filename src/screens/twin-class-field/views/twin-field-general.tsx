"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { FeaturerTypes, useFeaturerSelectAdapter } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  TwinClassFieldUpdateRq,
  TwinClassFieldV2_DETAILED,
  useFieldUpdate,
} from "@/entities/twin-class-field";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinFieldGeneral({
  twinFieldId,
  twinField,
}: {
  twinFieldId: string;
  twinField: TwinClassFieldV2_DETAILED;
}) {
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const { updateField } = useFieldUpdate();
  const router = useRouter();

  const permissionAdapter = usePermissionSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(13);

  async function update(newField: TwinClassFieldUpdateRq) {
    try {
      await updateField({
        fieldId: twinFieldId,
        body: newField,
      });

      router.refresh();
    } catch (e) {
      toast.error("not updated twin field");
    }
  }

  const nameSettings: InPlaceEditProps<typeof twinField.name> = {
    id: "name",
    value: twinField.name,
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
        nameI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof twinField.description> = {
    id: "description",
    value: twinField.description,
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
        descriptionI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const requiredSettings: InPlaceEditProps<typeof twinField.required> = {
    id: "abstract",
    value: twinField.required,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return update({
        required: value,
      });
    },
  };

  const viewPermissionSettings: InPlaceEditProps<
    typeof twinField.viewPermissionId
  > = {
    id: "viewPermissionId",
    value: twinField.viewPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...permissionAdapter,
    },
    renderPreview: twinField.viewPermission
      ? (_) => <PermissionResourceLink data={twinField.viewPermission} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ viewPermissionId: id });
    },
  };

  const editPermissionSettings: InPlaceEditProps<
    typeof twinField.editPermissionId
  > = {
    id: "editPermissionId",
    value: twinField.editPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...permissionAdapter,
    },
    renderPreview: twinField.editPermission
      ? (_) => <PermissionResourceLink data={twinField.editPermission} />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ editPermissionId: id });
    },
  };

  const fieldTyperAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      fieldTyperFeaturerId: twinField.fieldTyperFeaturerId,
    },
    title: "Update field typer",
    onSubmit: (values) => {
      return update({
        fieldTyperFeaturerId: values.fieldTyperFeaturerId[0].id,
        fieldTyperParams: values.fieldTyperFeaturerParams,
      });
    },
    valuesInfo: {
      fieldTyperFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Field typer",
        typeId: FeaturerTypes.fieldTyper,
        paramsFieldName: "fieldTyperFeaturerParams",
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
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinField.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {twinField.twinClass && (
                <TwinClassResourceLink data={twinField.twinClass} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{twinField.key}</TableCell>
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
            onClick={() => openWithSettings(fieldTyperAutoDialogSettings)}
          >
            <TableCell>Field typer</TableCell>
            <TableCell>
              {twinField.fieldTyperFeaturer && (
                <FeaturerResourceLink
                  data={twinField.fieldTyperFeaturer}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Required</TableCell>
            <TableCell>
              <InPlaceEdit {...requiredSettings} />
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>View Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...viewPermissionSettings} />
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Edit Permission</TableCell>
            <TableCell>
              <InPlaceEdit {...editPermissionSettings} />
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
