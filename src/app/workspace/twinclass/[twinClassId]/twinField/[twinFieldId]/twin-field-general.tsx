import { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import {
  FeaturerResourceLink,
  FeaturerTypes,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import {
  PermissionResourceLink,
  usePermissionSelectAdapter,
} from "@/entities/permission";
import { TwinClassResourceLink } from "@/entities/twin-class";
import {
  TwinClassFieldUpdateRq,
  TwinClassFieldV2_DETAILED,
} from "@/entities/twin-class-field";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PrivateApiContext } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

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
  const api = useContext(PrivateApiContext);
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFeaturerSelectAdapter(13);

  async function updateField(newField: TwinClassFieldUpdateRq) {
    try {
      const response = await api.twinClassField.update({
        fieldId: field.id!,
        body: newField,
      });

      if (response.error) {
        toast.error(response.error.statusDetails);
      }

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

  const viewPermissionSettings: InPlaceEditProps<any> = {
    id: "viewPermissionId",
    value: field.viewPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: field.viewPermission
      ? (_) => <PermissionResourceLink data={field.viewPermission} />
      : undefined,
    onSubmit: async (value) => {
      return updateField({ viewPermissionId: value[0].id });
    },
  };

  const editPermissionSettings: InPlaceEditProps<any> = {
    id: "editPermissionId",
    value: field.editPermissionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission...",
      ...pAdapter,
    },
    renderPreview: field.editPermission
      ? (_) => <PermissionResourceLink data={field.editPermission} />
      : undefined,
    onSubmit: async (value) => {
      return updateField({ editPermissionId: value[0].id });
    },
  };

  const fieldTyperAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      fieldTyperFeaturerId: field.fieldTyperFeaturerId,
    },
    title: "Update field typer",
    onSubmit: (values) => {
      return updateField({
        fieldTyperFeaturerId: values.fieldTyperFeaturerId.id,
        fieldTyperParams: values.fieldTyperParams,
      });
    },
    valuesInfo: {
      fieldTyperFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Field typer",
        typeId: FeaturerTypes.fieldTyper,
        paramsFieldName: "fieldTyperFeaturerParams",
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
            <TableCell>
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
