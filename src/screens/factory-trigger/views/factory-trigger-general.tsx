import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import {
  FactoryConditionSet_DETAILED,
  useFactoryConditionSetSelectAdapter,
} from "@/entities/factory-condition-set";
import { useFactoryTriggerUpdate } from "@/entities/factory-trigger";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryTriggerContext } from "@/features/factory-trigger";
import { FactoryResourceLink } from "@/features/factory/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryTriggerGeneral() {
  const { factoryTrigger, refresh } = useContext(FactoryTriggerContext);
  const { updateFactoryTrigger } = useFactoryTriggerUpdate();
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const { confirm } = useActionDialogs();

  const factorySettings: InPlaceEditProps<typeof factoryTrigger.twinFactoryId> =
    {
      id: "twinFactoryId",
      value: factoryTrigger.twinFactoryId,
      valueInfo: {
        type: AutoFormValueType.combobox,
        selectPlaceholder: "Select factory...",
        ...factoryAdapter,
      },
      renderPreview: factoryTrigger.factory
        ? () => (
            <FactoryResourceLink data={factoryTrigger.factory!} withTooltip />
          )
        : undefined,
      onSubmit: async (value) => {
        const id = (value as unknown as Array<{ id: string }>)[0]?.id;
        return updateFactoryTrigger({
          body: {
            twinFactoryTriggers: [
              {
                id: factoryTrigger.id,
                twinFactoryId: id,
              },
            ],
          },
        }).then(refresh);
      },
    };

  const inputTwinClassSettings: InPlaceEditProps<
    typeof factoryTrigger.inputTwinClassId
  > = {
    id: "inputTwinClassId",
    value: factoryTrigger.inputTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...twinClassAdapter,
    },
    renderPreview: factoryTrigger.inputTwinClass
      ? () => (
          <TwinClassResourceLink
            data={factoryTrigger.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryTrigger({
        body: {
          twinFactoryTriggers: [
            {
              inputTwinClassId: id,
              id: factoryTrigger.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const factoryConditionSetSettings: InPlaceEditProps<
    typeof factoryTrigger.twinFactoryConditionSetId
  > = {
    id: "twinFactoryConditionSetId",
    value: factoryTrigger.twinFactoryConditionSetId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select Factory condition set...",
      ...factoryConditionSetAdapter,
    },
    renderPreview: factoryTrigger.twinFactoryConditionSetId
      ? () => (
          <FactoryConditionSetResourceLink
            data={
              factoryTrigger.factoryConditionSet as FactoryConditionSet_DETAILED
            }
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;

      return updateFactoryTrigger({
        body: {
          twinFactoryTriggers: [
            {
              twinFactoryConditionSetId: id,
              id: factoryTrigger.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  function switchInvert() {
    const action = factoryTrigger.twinFactoryConditionInvert
      ? "disable"
      : "enable";
    const status = factoryTrigger.twinFactoryConditionInvert
      ? "Disable"
      : "Enable";

    confirm({
      title: `${status} Invert`,
      body: `Are you sure you want to ${action} action for this trigger?`,
      onSuccess: () => {
        return updateFactoryTrigger({
          body: {
            twinFactoryTriggers: [
              {
                twinFactoryConditionInvert:
                  !factoryTrigger.twinFactoryConditionInvert,
                id: factoryTrigger.id,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  function switchActive() {
    const action = factoryTrigger.active ? "disable" : "enable";
    const status = factoryTrigger.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this trigger?`,
      onSuccess: () => {
        return updateFactoryTrigger({
          body: {
            twinFactoryTriggers: [
              {
                active: !factoryTrigger.active,
                id: factoryTrigger.id,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  const descriptionSettings: InPlaceEditProps<
    typeof factoryTrigger.description
  > = {
    id: "description",
    value: factoryTrigger.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return updateFactoryTrigger({
        body: {
          twinFactoryTriggers: [
            {
              description: value,
              id: factoryTrigger.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const twinTriggerSettings: InPlaceEditProps<
    typeof factoryTrigger.twinTriggerId
  > = {
    id: "twinTriggerId",
    value: factoryTrigger.twinTriggerId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin trigger...",
      ...twinTriggerAdapter,
    },
    renderPreview: factoryTrigger.twinTrigger
      ? () => (
          <TwinTriggerResourceLink
            data={factoryTrigger.twinTrigger!}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryTrigger({
        body: {
          twinFactoryTriggers: [
            {
              twinTriggerId: id,
              id: factoryTrigger.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  function switchAsync() {
    const action = factoryTrigger.async ? "disable" : "enable";
    const status = factoryTrigger.async ? "Disable" : "Enable";

    confirm({
      title: `${status} Async`,
      body: `Are you sure you want to ${action} action for this trigger?`,
      onSuccess: () => {
        return updateFactoryTrigger({
          body: {
            twinFactoryTriggers: [
              {
                async: !factoryTrigger.async,
                id: factoryTrigger.id,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={factoryTrigger.id} variant="long" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Twin factory</TableCell>
            <TableCell>
              <InPlaceEdit {...factorySettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Input twin class</TableCell>
            <TableCell>
              <InPlaceEdit {...inputTwinClassSettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Twin factory condition set</TableCell>
            <TableCell>
              <InPlaceEdit {...factoryConditionSetSettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Twin factory condition invert</TableCell>
            <TableCell>
              <Switch
                checked={factoryTrigger.twinFactoryConditionInvert ?? false}
                onCheckedChange={switchInvert}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={factoryTrigger.active ?? false}
                onCheckedChange={switchActive}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Twin trigger</TableCell>
            <TableCell>
              <InPlaceEdit {...twinTriggerSettings} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Async</TableCell>
            <TableCell>
              <Switch
                checked={factoryTrigger.async ?? false}
                onCheckedChange={switchAsync}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
