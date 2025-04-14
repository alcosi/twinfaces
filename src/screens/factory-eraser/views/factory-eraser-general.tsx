"use client";

import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { FactoryResourceLink } from "@/entities/factory";
import {
  FactoryConditionSetResourceLink,
  useFactoryConditionSetSelectAdapter,
} from "@/entities/factory-condition-set";
import {
  ERASE_ACTION_TYPES,
  FactoryEraserUpdate,
  useFactoryEraserUpdate,
} from "@/entities/factory-eraser";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { FactoryEraserContext } from "@/features/factory-eraser";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { createFixedSelectAdapter } from "@/shared/libs";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryEraserGeneral() {
  const { eraser, refresh } = useContext(FactoryEraserContext);
  const { updateFactoryEraser } = useFactoryEraserUpdate();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();

  async function update(body: FactoryEraserUpdate) {
    try {
      await updateFactoryEraser({ factoryEraserId: eraser.id, body });
      toast.success("Factory eraser was updated successfully!");
      refresh?.();
    } catch (e) {
      toast.error("Failed to update factory eraser");
    }
  }

  const inputTwinClassSettings: InPlaceEditProps<
    typeof eraser.inputTwinClassId
  > = {
    id: "inputTwinClassId",
    value: eraser.inputTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select Twin class...",
      ...twinClassAdapter,
    },
    renderPreview: eraser.inputTwinClassId
      ? (_) => (
          <TwinClassResourceLink
            data={eraser.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;

      return update({
        eraser: {
          inputTwinClassId: id,
        },
      });
    },
  };

  const factoryConditionSetSettings: InPlaceEditProps<
    typeof eraser.factoryConditionSetId
  > = {
    id: "factoryConditionSetId",
    value: eraser.factoryConditionSetId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select Factory...",
      ...factoryConditionSetAdapter,
    },
    renderPreview: eraser.factoryConditionSetId
      ? (_) => (
          <FactoryConditionSetResourceLink
            data={eraser.factoryConditionSet}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;

      return update({
        eraser: {
          twinFactoryConditionSetId: id,
        },
      });
    },
  };

  const factoryConditionSetInvertSettings: InPlaceEditProps<
    typeof eraser.factoryConditionSetInvert
  > = {
    id: "factoryConditionSetInvert",
    value: eraser.factoryConditionSetInvert,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return update({
        eraser: {
          twinFactoryConditionInvert: value,
        },
      });
    },
  };

  const activeSettings: InPlaceEditProps<typeof eraser.active> = {
    id: "active",
    value: eraser.active,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return update({
        eraser: {
          active: value,
        },
      });
    },
  };

  const eraseActionSettings: InPlaceEditProps<typeof eraser.action> = {
    id: "action",
    value: eraser.action,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...createFixedSelectAdapter(ERASE_ACTION_TYPES),
    },
    onSubmit: async (value) => {
      return update({
        eraser: {
          action: value,
        },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof eraser.description> = {
    id: "description",
    value: eraser.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        eraser: {
          description: value,
        },
      });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={eraser.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Factory</TableCell>
            <TableCell>
              {eraser.factory && (
                <FactoryResourceLink data={eraser.factory} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Input class</TableCell>
            <TableCell>
              <InPlaceEdit {...inputTwinClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Condition set</TableCell>
            <TableCell>
              <InPlaceEdit {...factoryConditionSetSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Condition invert</TableCell>
            <TableCell>
              <InPlaceEdit {...factoryConditionSetInvertSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <InPlaceEdit {...activeSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Erase action</TableCell>
            <TableCell>
              <InPlaceEdit {...eraseActionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
