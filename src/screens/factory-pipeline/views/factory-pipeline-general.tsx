import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  FactoryResourceLink,
  useFactorySelectAdapter,
} from "@/entities/factory";
import {
  FactoryConditionSetResourceLink,
  useFactoryConditionSetSelectAdapter,
} from "@/entities/factory-condition-set";
import { useUpdateFactoryPipeline } from "@/entities/factory-pipeline";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import {
  TwinClassStatusResourceLink,
  useTwinStatusSelectAdapter,
} from "@/entities/twin-status";
import { FactoryPipelineContext } from "@/features/factory-pipeline";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import {
  GuidWithCopy,
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
      ? (_) => (
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
      ? (_) => (
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

  const factoryConditionSetInvertSettings: InPlaceEditProps<
    typeof pipeline.factoryConditionSetInvert
  > = {
    id: "factoryConditionSetInvert",
    value: pipeline.factoryConditionSetInvert,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            factoryConditionSetInvert: value,
          },
        },
      }).then(refresh);
    },
  };

  const activeSettings: InPlaceEditProps<typeof pipeline.active> = {
    id: "active",
    value: pipeline.active,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateFactoryPipeline({
        factoryPipelineId: pipeline.id,
        body: {
          factoryPipeline: {
            active: value,
          },
        },
      }).then(refresh);
    },
  };

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
      ? (_) => (
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
      ? (_) => <FactoryResourceLink data={pipeline.nextFactory} withTooltip />
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
      inputProps: {
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
