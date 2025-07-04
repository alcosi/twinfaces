import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinFlow, TwinFlowUpdateRq } from "@/entities/twin-flow";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { PrivateApiContext } from "@/shared/api";
import { formatIntlDate, reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinflowGeneral({
  twinflow,
  onChange,
}: {
  twinflow: TwinFlow;
  onChange: () => void;
}) {
  const api = useContext(PrivateApiContext);
  const twinStatusAdapter = useTwinStatusSelectAdapter();

  async function updateTwinFlow(newFlow: TwinFlowUpdateRq) {
    try {
      await api.twinFlow.update({ id: twinflow.id!, body: newFlow });
      onChange?.();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const nameSettings: InPlaceEditProps<typeof twinflow.name> = {
    id: "name",
    value: twinflow.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinFlow({
        nameI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof twinflow.description> = {
    id: "description",
    value: twinflow.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinFlow({
        descriptionI18n: { translationInCurrentLocale: value },
      });
    },
  };

  const initialStatusAutoDialogSettings: InPlaceEditProps<
    typeof twinflow.initialStatusId
  > = {
    id: "initialStatusId",
    value: twinflow.initialStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select status...",
      ...twinStatusAdapter,
      getItems: async (search: string) => {
        return twinStatusAdapter.getItems(search, {
          twinClassIdMap: reduceToObject({
            list: toArray(twinflow.twinClassId),
            defaultValue: true,
          }),
        });
      },
    },
    renderPreview: twinflow.initialStatus
      ? (_) => (
          <TwinClassStatusResourceLink
            data={twinflow.initialStatus!}
            twinClassId={twinflow.twinClassId!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateTwinFlow({ initialStatusId: id });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinflow.id} variant={"long"} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {twinflow.twinClass && (
                <TwinClassResourceLink
                  data={twinflow.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
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

          <TableRow>
            <TableCell>Initial status</TableCell>
            <TableCell>
              <InPlaceEdit {...initialStatusAutoDialogSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {formatIntlDate(twinflow.createdAt!, "datetime-local")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
