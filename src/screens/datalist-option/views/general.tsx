import { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { DataList } from "@/entities/datalist";
import {
  DATALIST_OPTION_STATUS_TYPES,
  DataListOptionUpdateV1,
  useUpdateDatalistOption,
} from "@/entities/datalist-option";
import { DataListOptionContext } from "@/features/datalist-option";
import { DatalistResourceLink } from "@/features/datalist/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { createFixedSelectAdapter } from "@/shared/libs";
import { ColorPicker, GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function DatalistOptionGeneral() {
  const { datalistOption, optionId, refresh } = useContext(
    DataListOptionContext
  );
  const { updateDatalistOption } = useUpdateDatalistOption();
  const attributeKeys = Object.keys(datalistOption.attributes ?? {});

  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);

  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const [backgroundColor, setBackgroundColor] = useState(
    datalistOption.backgroundColor
  );
  const [fontColor, setFontColor] = useState(datalistOption.fontColor);

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditStatusDialogOpen(true);
  }

  async function update(
    fields: Omit<DataListOptionUpdateV1, "id" | "dataListId">
  ) {
    try {
      await updateDatalistOption({
        body: {
          dataListOptions: [
            {
              id: optionId,
              dataListId: datalistOption.dataList?.id,
              ...fields,
            },
          ],
        },
      });
      toast.success("Datalist option updated successfully!");
      refresh?.();
    } catch {
      toast.error("Failed to update datalist option");
    }
  }

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: datalistOption.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        optionI18n: {
          translationInCurrentLocale: value as string,
          translations: {},
        },
      });
    },
  };

  const statusSettings: InPlaceEditProps<any> = {
    id: "status",
    value: datalistOption.status,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...createFixedSelectAdapter(DATALIST_OPTION_STATUS_TYPES),
    },
    onSubmit: async (value) => {
      return update({ status: value[0] });
    },
  };

  const renderTableCell = (status: string): InPlaceEditProps<string> => ({
    id: `attribute-${status}`,
    value: datalistOption.attributes?.[status] ?? "",
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (newValue: string) =>
      update({
        attributesMap: {
          ...datalistOption.attributes,
          [status]: newValue,
        },
      }),
  });

  const backgroundColorAutoDialogSettings: AutoEditDialogSettings = {
    value: { backgroundColor: datalistOption.backgroundColor },
    title: "Update background color",
    onSubmit: (values) => {
      setBackgroundColor(values.backgroundColor);
      return update({ backgroundColor: values.backgroundColor });
    },
    valuesInfo: {
      backgroundColor: {
        type: AutoFormValueType.color,
        label: "Background Color",
      },
    },
  };

  const fontColorAutoDialogSettings: AutoEditDialogSettings = {
    value: { fontColor: datalistOption.fontColor },
    title: "Update font Color",
    onSubmit: (values) => {
      setFontColor(values.fontColor);
      return update({ fontColor: values.fontColor });
    },
    valuesInfo: {
      fontColor: {
        type: AutoFormValueType.color,
        label: "Font Color",
      },
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={datalistOption.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Datalist</TableCell>
            <TableCell>
              {datalistOption.dataList && (
                <DatalistResourceLink
                  data={datalistOption.dataList as DataList}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Icon</TableCell>
            <TableCell>{datalistOption.icon}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>
              <InPlaceEdit {...statusSettings} />
            </TableCell>
          </TableRow>

          {attributeKeys.map((key) => (
            <TableRow key={key} className="cursor-pointer">
              <TableCell>{key}</TableCell>
              <TableCell>
                <InPlaceEdit {...renderTableCell(key)} />
              </TableCell>
            </TableRow>
          ))}

          {/* <TableRow>  //todo unlock when it appears in schematics
            <TableCell>Created At</TableCell>
            <TableCell>
              {datalistOption.createdAt &&
                formatIntlDate(datalistOption.createdAt, "datetime-local")}
            </TableCell>
          </TableRow> */}

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(backgroundColorAutoDialogSettings)}
          >
            <TableCell>Background Color</TableCell>
            <TableCell>
              <ColorPicker color={backgroundColor} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(fontColorAutoDialogSettings)}
          >
            <TableCell>Font Color</TableCell>
            <TableCell>
              <ColorPicker color={fontColor} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editStatusDialogOpen}
        onOpenChange={setEditStatusDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </InPlaceEditContextProvider>
  );
}
