import React, { useContext, useState } from "react";
import { TwinClassField, TwinClassFieldUpdateRq } from "@/entities/twinClass";
import { ApiContext } from "@/shared/api";
import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import { Table, TableBody, TableCell, TableRow } from "@/components/base/table";

export function TwinFieldGeneral({
  field,
  onChange,
}: {
  field: TwinClassField;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  async function updateField(newField: TwinClassFieldUpdateRq) {
    try {
      await api.twinClass.updateField({ fieldId: field.id!, body: newField });
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const nameAutoDialogSettings: AutoEditDialogSettings = {
    value: { name: field.name },
    title: "Update name",
    onSubmit: (values) => {
      return updateField({
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
    value: { description: field.description },
    title: "Update description",
    onSubmit: (values) => {
      return updateField({
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

  return (
    <>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>{field.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{field.key}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(nameAutoDialogSettings)}
          >
            <TableCell>Name</TableCell>
            <TableCell>{field.name}</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(descriptionAutoDialogSettings)}
          >
            <TableCell>Description</TableCell>
            <TableCell>{field.description}</TableCell>
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
