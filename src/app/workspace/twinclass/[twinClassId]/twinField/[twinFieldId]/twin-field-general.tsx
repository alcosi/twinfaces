import { useContext, useState } from "react";
import { AutoFormValueType } from "@/components/auto-field";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { GuidWithCopy } from "@/shared/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { z } from "zod";
import {
  TwinClassFieldUpdateRq,
  TwinClassFieldV2_DETAILED,
} from "@/entities/twin-class-field";
import { ApiContext } from "@/shared/api";
import { TwinClassResourceLink } from "@/entities/twinClass";
import {
  FeaturerResourceLink,
  FeaturerTypes,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import {
  PermissionResourceLink,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";

export function TwinFieldGeneral({
  field,
  onChange,
}: {
  field: TwinClassFieldV2_DETAILED;

  onChange: () => any;
}) {
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const api = useContext(ApiContext);
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFeaturerSelectAdapter(13);

  async function updateField(newField: TwinClassFieldUpdateRq) {
    try {
      await api.twinClassField.update({ fieldId: field.id!, body: newField });
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: field.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateField({
        nameI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: field.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateField({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const requiredSettings: InPlaceEditProps = {
    id: "abstract",
    value: field.required,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return updateField({
        required: value as boolean,
      });
    },
  };

  const viewPermissionAutoDialogSettings: AutoEditDialogSettings = {
    value: { viewPermissionId: field.viewPermissionId },
    title: "Update view permission",
    onSubmit: (values) => {
      return updateField({ viewPermissionId: values.viewPermissionId[0].id });
    },
    valuesInfo: {
      viewPermissionId: {
        type: AutoFormValueType.combobox,
        label: "View permission",
        selectPlaceholder: "Select permission...",
        ...pAdapter,
      },
    },
  };

  const editPermissionAutoDialogSettings: AutoEditDialogSettings = {
    value: { editPermissionId: field.editPermissionId },
    title: "Update edit permission",
    onSubmit: (values) => {
      return updateField({ editPermissionId: values.editPermissionId[0].id });
    },
    valuesInfo: {
      editPermissionId: {
        type: AutoFormValueType.combobox,
        label: "Edit permission",
        selectPlaceholder: "Select permission...",
        ...pAdapter,
      },
    },
  };

  const fieldTyperAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      fieldTyperFeaturerId: field.fieldTyperFeaturerId,
    },
    title: "Update field typer",
    onSubmit: (values) => {
      return updateField({
        fieldTyperFeaturerId: values.fieldTyperFeaturerId,
        fieldTyperParams: values.fieldTyperFeaturer,
      });
    },
    valuesInfo: {
      fieldTyperFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Field typer",
        typeId: FeaturerTypes.fieldTyper,
        ...fAdapter,
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
              <GuidWithCopy value={field.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell className="cursor-pointer">
              {field.twinClass && (
                <TwinClassResourceLink data={field.twinClass} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{field.key}</TableCell>
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
              {field.fieldTyperFeaturer && (
                <FeaturerResourceLink
                  data={field.fieldTyperFeaturer}
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

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(viewPermissionAutoDialogSettings)}
          >
            <TableCell>View Permission</TableCell>
            <TableCell>
              {field.viewPermission && (
                <PermissionResourceLink
                  data={field.viewPermission}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(editPermissionAutoDialogSettings)}
          >
            <TableCell>Edit Permission</TableCell>
            <TableCell>
              {field.editPermission && (
                <PermissionResourceLink
                  data={field.editPermission}
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
