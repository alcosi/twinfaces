"use client";

import { DatalistContext } from "@/features/datalist";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";
import { useContext, useEffect, useRef, useState } from "react";
import {
  DATALIST_ATTRIBUTE_SCHEMA,
  DataListAttribute,
  DataListCreateRqV1,
  DataListUpdateRqV1,
  useDatalistUpdate,
} from "@/entities/datalist";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { toast } from "sonner";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { ColumnDef } from "@tanstack/table-core";
import { PagedResponse } from "@/shared/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatalistAttributeFormFields } from "@/screens/datalist";

export function DatalistGeneral() {
  const tableRef = useRef<DataTableHandle>(null);
  const { datalist, fetchDatalist } = useContext(DatalistContext);
  const { updateDatalist } = useDatalistUpdate();
  let [keyCountAttribute, setKeyCountAttribute] = useState<number>(0);

  const attributeForm = useForm<z.infer<typeof DATALIST_ATTRIBUTE_SCHEMA>>({
    resolver: zodResolver(DATALIST_ATTRIBUTE_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
    },
  });

  useEffect(() => {
    if (!datalist) return;

    const totalKeyAttributes = Object.values(datalist).reduce((acc, value) => {
      return (
        acc +
        (typeof value === "object" && value !== null && "key" in value ? 1 : 0)
      );
    }, 0);

    setKeyCountAttribute(totalKeyAttributes);
  }, [datalist]);

  if (!datalist) {
    console.error("DatalistGeneral: no datalist");
    return null;
  }

  async function update(newDatalist: DataListUpdateRqV1) {
    if (!datalist) {
      console.error("updateDatalist: no datalist");
      return;
    }

    updateDatalist({ dataListId: datalist.id!, body: newDatalist })
      .then(() => {
        fetchDatalist();
      })
      .catch(() => {
        toast.error("not updated datalist");
      });
  }

  const keySettings: InPlaceEditProps = {
    id: "key",
    value: datalist.key,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        key: value as string,
      });
    },
  };

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: datalist.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        nameI18n: {
          translationInCurrentLocale: value as string,
          translations: {},
        },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: datalist.description,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        descriptionI18n: {
          translationInCurrentLocale: value as string,
          translations: {},
        },
      });
    },
  };

  function buildAttributeSetting(index: number, field: "key" | "name") {
    const attributeValue = `attribute${index}`;

    if (!datalist) {
      throw new Error("datalist is undefined");
    }

    const dataListAttributeTyped = datalist as Record<
      string,
      { key?: string; name?: string } | undefined
    >;

    const isKeyField = field === "key";

    const settings: InPlaceEditProps = {
      id: attributeValue,
      value: isKeyField
        ? dataListAttributeTyped[attributeValue]?.key
        : dataListAttributeTyped[attributeValue]?.name,
      valueInfo: {
        type: AutoFormValueType.string,
        label: "",
        inputProps: {
          fieldSize: "sm",
        },
      },
      schema: z.string().min(3),
      onSubmit: (value) => {
        const updateData: Record<string, any> = {};
        updateData[attributeValue] = {
          key: isKeyField
            ? (value as string)
            : dataListAttributeTyped[attributeValue]?.key,
          nameI18n: {
            translationInCurrentLocale: isKeyField
              ? dataListAttributeTyped[attributeValue]?.name
              : (value as string),
            translations: {},
          },
        };

        return update(updateData);
      },
    };

    return settings;
  }

  const colDefs: Record<
    keyof Pick<DataListAttribute, "index" | "key" | "name">,
    ColumnDef<DataListAttribute>
  > = {
    index: {
      id: "index",
      accessorKey: "index",
      header: "№",
      cell: ({ row }) => row.index + 1,
    },

    key: {
      id: "key",
      accessorKey: "key",
      cell: ({ row }) => {
        return (
          <div className="relative ">
            <div className="absolute top-[-15px] left-0 z-10 w-full">
              <InPlaceEdit {...buildAttributeSetting(row.index + 1, "key")} />
            </div>
          </div>
        );
      },
    },

    name: {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="relative">
            <div className="absolute top-[-15px] left-0 z-10 w-full">
              <InPlaceEdit {...buildAttributeSetting(row.index + 1, "name")} />
            </div>
          </div>
        );
      },
    },
  };

  async function fetchDataListAttribute(): Promise<
    PagedResponse<DataListAttribute>
  > {
    const filteredAttributes = datalist
      ? Object.fromEntries(
          Object.entries(datalist).filter(([key]) =>
            key.startsWith("attribute")
          )
        )
      : {};

    const attributeValues = Object.values(filteredAttributes);

    return {
      data: (Array.isArray(attributeValues)
        ? attributeValues
        : [attributeValues]) as DataListAttribute[],
      pagination: {},
    };
  }

  async function handleOnCreateSubmit(
    formValues: z.infer<typeof DATALIST_ATTRIBUTE_SCHEMA>
  ) {
    if (!datalist) {
      console.error("updateDatalist: no datalist");
      return;
    }

    const { key, name, ...rest } = formValues;

    const requestBody: DataListCreateRqV1 = {
      ...rest,
      ["attribute" + Number(keyCountAttribute + 1)]: {
        key: key,
        nameI18n: {
          translationInCurrentLocale: name as string,
          translations: {},
        },
      },
    };

    updateDatalist({ dataListId: datalist.id!, body: requestBody })
      .then(() => {
        fetchDatalist();
        toast.success("Datalist attribute created successfully!");
      })
      .catch(() => {
        toast.error("not updated datalist");
      });

    attributeForm.reset({
      key: "",
      name: "",
    });
  }

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={datalist?.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>
              <InPlaceEdit {...keySettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Сreated at</TableCell>
            <TableCell>
              {new Date(datalist?.createdAt!).toLocaleDateString()}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Updated at</TableCell>
            {datalist.updatedAt && (
              <TableCell>
                {new Date(datalist.updatedAt).toLocaleDateString()}
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>

      <CrudDataTable
        hideRefresh
        title="Attributes"
        ref={tableRef}
        columns={[colDefs.index, colDefs.key, colDefs.name]}
        getRowId={(row) => row.index!}
        fetcher={fetchDataListAttribute}
        disablePagination
        dialogForm={keyCountAttribute < 4 ? attributeForm : undefined}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <DatalistAttributeFormFields control={attributeForm.control} />
        )}
      />
    </InPlaceEditContextProvider>
  );
}
