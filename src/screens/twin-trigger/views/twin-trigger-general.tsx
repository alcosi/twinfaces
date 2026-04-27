import { useContext, useState } from "react";
import z from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import {
  FeaturerTypes,
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { useTwinTriggerUpdate } from "@/entities/twin-trigger";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinTriggerContext } from "@/features/twin-trigger";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TwinTriggerGeneral() {
  const { twinTriggerId, twinTrigger, refresh } =
    useContext(TwinTriggerContext);
  const { updateTwinTrigger } = useTwinTriggerUpdate();
  const featurerAdapter = useFeaturerSelectAdapter(15);
  const { confirm } = useActionDialogs();

  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const [editFieldDialogOpen, setEditFieldDialogOpen] =
    useState<boolean>(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const twinTriggerFeaturerSettings: AutoEditDialogSettings = {
    value: {
      triggerFeaturerId: twinTrigger.triggerFeaturer
        ? [twinTrigger.triggerFeaturer]
        : undefined,
      triggerParams: twinTrigger.triggerParams ?? {},
    },
    title: "Update twin trigger",
    onSubmit: (values) => {
      return updateTwinTrigger({
        body: {
          triggers: [
            {
              triggerFeaturerId: values.triggerFeaturerId[0].id,
              triggerParams: values.triggerParams,
              id: twinTrigger.id,
            },
          ],
        },
      }).then(refresh);
    },
    valuesInfo: {
      triggerFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Twin trigger featurer",
        typeId: FeaturerTypes.trigger,
        paramsFieldName: "triggerParams",
        ...featurerAdapter,
      },
    },
  };

  const jobClassSettings: AutoEditDialogSettings = {
    title: "Update job class",
    value: {
      jobTwinClassId: twinTrigger.jobTwinClassId,
    },
    valuesInfo: {
      jobTwinClassId: {
        type: AutoFormValueType.complexCombobox,
        label: "Job class",
        adapter: twinClassAdapter,
        extraFilters: buildTwinClassFilters(),
        mapExtraFilters: mapTwinClassFilters,
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...,",
      },
    },

    onSubmit: async (values) => {
      const id = values.jobClassId[0].id;

      return updateTwinTrigger({
        body: {
          triggers: [
            {
              id: twinTrigger.id,
              jobTwinClassId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  function switchActive() {
    const action = twinTrigger.active ? "disable" : "enable";
    const status = twinTrigger.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this twin trigger`,
      onSuccess: () => {
        return updateTwinTrigger({
          body: {
            triggers: [{ id: twinTriggerId, active: !twinTrigger.active }],
          },
        }).then(refresh);
      },
    });
  }

  const nameSettings: InPlaceEditProps<typeof twinTrigger.name> = {
    id: "name",
    value: twinTrigger.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwinTrigger({
        body: {
          triggers: [
            {
              name: value,
              id: twinTriggerId,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof twinTrigger.description> =
    {
      id: "description",
      value: twinTrigger.description,
      valueInfo: {
        type: AutoFormValueType.string,
        label: "",
        input_props: {
          fieldSize: "sm",
        },
      },
      schema: z.string().min(3),
      onSubmit: (value) => {
        return updateTwinTrigger({
          body: {
            triggers: [
              {
                description: value,
                id: twinTriggerId,
              },
            ],
          },
        }).then(refresh);
      },
    };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twinTrigger.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(twinTriggerFeaturerSettings)}
          >
            <TableCell>Twin trigger featurer</TableCell>
            <TableCell>
              {twinTrigger.triggerFeaturer && (
                <FeaturerResourceLink
                  data={twinTrigger.triggerFeaturer as Featurer_DETAILED}
                  params={twinTrigger.triggerDetailedParams}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(jobClassSettings)}
          >
            <TableCell>Job class</TableCell>
            <TableCell>
              {twinTrigger.jobTwinClass && (
                <TwinClassResourceLink
                  data={twinTrigger.jobTwinClass}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={twinTrigger.active ?? false}
                onCheckedChange={switchActive}
              />
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
        </TableBody>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </InPlaceEditContextProvider>
  );
}
