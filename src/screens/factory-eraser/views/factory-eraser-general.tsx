"use client";

import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import {
  ERASE_ACTION_TYPES,
  FactoryEraserUpdate,
  useFactoryEraserUpdate,
} from "@/entities/factory-eraser";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryEraserContext } from "@/features/factory-eraser";
import { FactoryResourceLink } from "@/features/factory/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { createFixedSelectAdapter } from "@/shared/libs";
import {
  GuidWithCopy,
  Switch,
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
  const { confirm } = useActionDialogs();

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
      ? () => (
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
      ? () => (
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

  function switchInvert() {
    const action = eraser.factoryConditionSetInvert ? "disable" : "enable";
    const status = eraser.factoryConditionSetInvert ? "Disable" : "Enable";

    confirm({
      title: `${status} Invert`,
      body: `Are you sure you want to ${action} action for this eraser?`,
      onSuccess: () => {
        return update({
          eraser: {
            twinFactoryConditionInvert: !eraser.factoryConditionSetInvert,
          },
        }).then(refresh);
      },
    });
  }

  function switchActive() {
    const action = eraser.active ? "disable" : "enable";
    const status = eraser.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this eraser?`,
      onSuccess: () => {
        return update({
          eraser: {
            active: !eraser.active,
          },
        }).then(refresh);
      },
    });
  }

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
      input_props: {
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
              <Switch
                checked={eraser.factoryConditionSetInvert ?? false}
                onCheckedChange={switchInvert}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={eraser.active ?? false}
                onCheckedChange={switchActive}
              />
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
