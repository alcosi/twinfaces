"use client";

import { useContext } from "react";
import { toast } from "sonner";

import { AutoFormValueType } from "@/components/auto-field";

import { DataListOption_DETAILED } from "@/entities/datalist-option";
import {
  TwinClass_DETAILED,
  useTwinClassDynamicMarkerSelectAdapter,
  useTwinClassSelectAdapter,
  useUpdateTwinClassDynamicMarker,
} from "@/entities/twin-class";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassDynamicMarkerContext } from "@/features/twin-class-dynamic-marker";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinClassDynamicMarkerGeneral() {
  const { updateTwinClassDynamicMarker } = useUpdateTwinClassDynamicMarker();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const markerAdapter = useTwinClassDynamicMarkerSelectAdapter();
  const { dynamicMarker, refresh } = useContext(TwinClassDynamicMarkerContext);

  async function update(updateData: any) {
    try {
      await updateTwinClassDynamicMarker({
        body: {
          dynamicMarkers: [
            {
              id: dynamicMarker.id,
              ...updateData,
            },
          ],
        },
      });
      refresh?.();
      toast.success("Dynamic marker updated successfully");
    } catch (error) {
      toast.error("Dynamic marker update failed");
      console.error(error);
    }
  }

  const twinClassSettings: InPlaceEditProps<typeof dynamicMarker.twinClassId> =
    {
      id: "twinClassId",
      value: dynamicMarker.twinClassId,
      valueInfo: {
        type: AutoFormValueType.combobox,
        selectPlaceholder: "Select twin class...",
        ...twinClassAdapter,
      },
      renderPreview: dynamicMarker.twinClass
        ? () => (
            <TwinClassResourceLink
              data={dynamicMarker.twinClass as TwinClass_DETAILED}
              withTooltip
            />
          )
        : undefined,
      onSubmit: async (value) => {
        const twinClassId = (value as unknown as Array<{ id: string }>)[0]?.id;
        return update({ twinClassId });
      },
    };

  const markerSettings: InPlaceEditProps<
    typeof dynamicMarker.markerDataListOptionId
  > = {
    id: "markerDataListOptionId",
    value: dynamicMarker.markerDataListOptionId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select marker...",
      ...markerAdapter,
    },
    renderPreview: dynamicMarker.markerDataListOption
      ? () => (
          <DatalistOptionResourceLink
            data={dynamicMarker.markerDataListOption as DataListOption_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const markerDataListOptionId = (
        value as unknown as Array<{ markerDataListOptionId: string }>
      )[0]?.markerDataListOptionId;
      return update({ markerDataListOptionId });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={dynamicMarker.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class</TableCell>
            <TableCell>
              <InPlaceEdit {...twinClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Validator set</TableCell>
            <TableCell>
              <GuidWithCopy
                value={dynamicMarker.twinValidatorSetId}
                variant="long"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Marker</TableCell>
            <TableCell>
              <InPlaceEdit {...markerSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
