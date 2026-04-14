import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { useUpdateFactoryPipeline } from "@/entities/factory-pipeline";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryPipelineContext } from "@/features/factory-pipeline";
import { FactoryResourceLink } from "@/features/factory/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryPipelineGeneral() {
  const { pipeline, refresh } = useContext(FactoryPipelineContext);
  const fAdapter = useFactorySelectAdapter();
  const tcAdapter = useTwinClassSelectAdapter();
  const fcsAdapter = useFactoryConditionSetSelectAdapter();
  const tsAdapter = useTwinStatusSelectAdapter();
  const { updateFactoryPipeline } = useUpdateFactoryPipeline();
  const { confirm } = useActionDialogs();

  const inputTwinClassSettings: InPlaceEditProps<
    typeof pipeline.inputTwinClassId
  > = {
    id: "inputTwinClassId",
    value: pipeline.inputTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select input twin class...",
      ...tcAdapter,
    },
    renderPreview: pipeline.inputTwinClass
      ? () => (
          <TwinClassResourceLink
            data={pipeline.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            inputTwinClassId: id,
          },
        },
      }).then(refresh);
    },
  };

  const factoryConditionSetSettings: InPlaceEditProps<
    typeof pipeline.factoryConditionSetId
  > = {
    id: "factoryConditionSetId",
    value: pipeline.factoryConditionSetId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select factory condition set...",
      ...fcsAdapter,
    },
    renderPreview: pipeline.factoryConditionSet
      ? () => (
          <FactoryConditionSetResourceLink
            data={pipeline.factoryConditionSet}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            factoryConditionSetId: id,
          },
        },
      }).then(refresh);
    },
  };

  function switchInvert() {
    const action = pipeline.factoryConditionSetInvert ? "disable" : "enable";
    const status = pipeline.factoryConditionSetInvert ? "Disable" : "Enable";

    confirm({
      title: `${status} Invert`,
      body: `Are you sure you want to ${action} action for this pipeline?`,
      onSuccess: () => {
        return updateFactoryPipeline({
          factoryPipelineId: pipeline.id,
          body: {
            factoryPipeline: {
              factoryConditionSetInvert: !pipeline.factoryConditionSetInvert,
            },
          },
        }).then(refresh);
      },
    });
  }

  function switchActive() {
    const action = pipeline.active ? "disable" : "enable";
    const status = pipeline.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this pipeline?`,
      onSuccess: () => {
        return updateFactoryPipeline({
          factoryPipelineId: pipeline.id,
          body: {
            factoryPipeline: {
              active: !pipeline.active,
            },
          },
        }).then(refresh);
      },
    });
  }

  const outputTwinStatusSettings: InPlaceEditProps<
    typeof pipeline.outputTwinStatusId
  > = {
    id: "outputTwinStatusId",
    value: pipeline.outputTwinStatusId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select output twin status...",
      ...tsAdapter,
    },
    renderPreview: pipeline.outputTwinStatus
      ? () => (
          <TwinClassStatusResourceLink
            data={pipeline.outputTwinStatus}
            twinClassId={pipeline.inputTwinClassId}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            outputStatusId: id,
          },
        },
      }).then(refresh);
    },
  };

  const nextFactorySettings: InPlaceEditProps<typeof pipeline.nextFactoryId> = {
    id: "nextFactoryId",
    value: pipeline.nextFactoryId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select next factory...",
      ...fAdapter,
    },
    renderPreview: pipeline.nextFactory
      ? () => <FactoryResourceLink data={pipeline.nextFactory} withTooltip />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            nextFactoryId: id,
          },
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof pipeline.description> = {
    id: "description",
    value: pipeline.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            description: value,
          },
        },
      }).then(refresh);
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={pipeline.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Factory</TableCell>
            <TableCell>
              <FactoryResourceLink data={pipeline.factory} />
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
                checked={pipeline.factoryConditionSetInvert ?? false}
                onCheckedChange={switchInvert}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={pipeline.active ?? false}
                onCheckedChange={switchActive}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Output status</TableCell>
            <TableCell>
              <InPlaceEdit {...outputTwinStatusSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Next factory</TableCell>
            <TableCell>
              <InPlaceEdit {...nextFactorySettings} />
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
