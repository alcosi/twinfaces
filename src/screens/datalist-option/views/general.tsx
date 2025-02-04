import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { GuidWithCopy } from "@/shared/ui";
import {
  DATALIST_OPTION_STATUS_TYPES,
  DataListOptionUpdateRqV1,
  DataListOptionV3,
  useUpdateDatalistOption,
} from "@/entities/datalist-option";
import { DataList, DatalistResourceLink } from "@/entities/datalist";
import React from "react";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { toast } from "sonner";
import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";

export function DatalistOptionGeneral({
  datalistOption,
  fetchDatalistOptions,
}: {
  datalistOption: DataListOptionV3;
  fetchDatalistOptions: () => void;
}) {
  const { updateDatalistOption } = useUpdateDatalistOption();
  const attributeKeys = Object.keys(datalistOption.attributes ?? {});

  async function update(newDatalistOption: DataListOptionUpdateRqV1) {
    if (!datalistOption.id) {
      toast.error("update Datalist Option: no datalist option");
      return;
    }

    updateDatalistOption({
      dataListOptionId: datalistOption.id,
      body: newDatalistOption,
    })
      .then(() => {
        toast.success("Datalist option created successfully!");
        fetchDatalistOptions();
      })
      .catch(() => {
        toast.error("not updated datalist option");
      });
  }

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: datalistOption.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      console.log(value);
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
      getById: async (key: string) =>
        DATALIST_OPTION_STATUS_TYPES?.find((o) => o === key),
      getItems: async (needle: string) => {
        return DATALIST_OPTION_STATUS_TYPES?.filter((type) =>
          type.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (o: unknown) => o as string,
      renderItem: (o: unknown) => o as string,
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
      inputProps: {
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

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
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
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
