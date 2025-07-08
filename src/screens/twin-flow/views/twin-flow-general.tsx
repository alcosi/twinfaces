import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinFlowUpdateRq, useUpdateTwinFlow } from "@/entities/twin-flow";
import {
  TwinStatusV2,
  useTwinStatusSelectAdapter,
} from "@/entities/twin-status";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinFlowContext } from "@/features/twin-flow";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { UserResourceLink } from "@/features/user/ui";
import {
  formatIntlDate,
  isPopulatedString,
  reduceToObject,
  toArray,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinFlowGeneral() {
  const { twinFlow, refresh } = useContext(TwinFlowContext);
  const { updateTwinFlow } = useUpdateTwinFlow();
  const twinStatusAdapter = useTwinStatusSelectAdapter();

  async function update(newTwinFlow: TwinFlowUpdateRq) {
    try {
      await updateTwinFlow({ twinflowId: twinFlow.id!, body: newTwinFlow });
      refresh?.();
    } catch {
      toast.error("Twin flow update failed");
    }
  }

  const nameSettings: InPlaceEditProps<typeof twinFlow.name> = {
    id: "name",
    value: twinFlow.name,
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

  const descriptionSettings: InPlaceEditProps<typeof twinFlow.description> = {
    id: "description",
    value: twinFlow.description,
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

  const initialStatusIdSettings: InPlaceEditProps<
    typeof twinFlow.initialStatusId
  > = {
    id: "initialStatusId",
    value: twinFlow.initialStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select status...",
      ...twinStatusAdapter,
      getItems: async (search: string) =>
        twinStatusAdapter.getItems(search, {
          twinClassIdMap: reduceToObject({
            list: toArray(twinFlow.twinClassId),
            defaultValue: true,
          }),
        }),
    },
    renderPreview: twinFlow.initialStatus
      ? (_) => (
          <TwinClassStatusResourceLink
            data={twinFlow.initialStatus as TwinStatusV2}
            twinClassId={twinFlow.twinClassId!}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ initialStatusId: id });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinFlow.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {twinFlow.twinClass && (
                <TwinClassResourceLink
                  data={twinFlow.twinClass as TwinClass_DETAILED}
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
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Initial status</TableCell>
            <TableCell>
              <InPlaceEdit {...initialStatusIdSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created by</TableCell>
            <TableCell>
              {twinFlow.createdByUser && (
                <UserResourceLink data={twinFlow.createdByUser} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {isPopulatedString(twinFlow.createdAt)
                ? formatIntlDate(twinFlow.createdAt, "datetime-local")
                : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
