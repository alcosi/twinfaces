import { useContext } from "react";
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
  TwinClassField,
  TwinClassFieldUpdateRq,
} from "@/entities/twinClassField";
import { ApiContext } from "@/shared/api";

export function TwinFieldGeneral({
  field,
  onChange,
}: {
  field: TwinClassField;
  onChange: () => any;
}) {
  const api = useContext(ApiContext);

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

          <TableRow className="cursor-pointer">
            <TableCell>Class</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Field typer</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Required</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>View Permission</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow className="cursor-pointer">
            <TableCell>Edit Permission</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
