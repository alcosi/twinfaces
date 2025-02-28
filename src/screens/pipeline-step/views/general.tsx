"use client";

import { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { FactoryResourceLink } from "@/entities/factory";
import {
  FactoryConditionSetResourceLink,
  useFactoryConditionSetSelectAdapter,
} from "@/entities/factory-condition-set";
import { FactoryPipelineResourceLink } from "@/entities/factory-pipeline";
import {
  FactoryPipelineStepUpdateRq,
  useFactoryPipelineStepUpdate,
} from "@/entities/factory-pipeline-step";
import {
  FeaturerResourceLink,
  FeaturerTypes,
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PipelineStepContext } from "@/features/pipeline-step";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function PipelineStepGeneral() {
  const { step, refresh } = useContext(PipelineStepContext);

  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const { updateFactoryPipelineStep } = useFactoryPipelineStepUpdate();
  const fCAdapter = useFactoryConditionSetSelectAdapter();
  const fAdapter = useFeaturerSelectAdapter(23);

  async function update(body: FactoryPipelineStepUpdateRq) {
    try {
      await updateFactoryPipelineStep({ factoryPipelineStepId: step.id, body });
      toast.success("Pipeline step update successfully!");
      refresh?.();
    } catch (e) {
      toast.error("Failed to update pipeline step");
    }
  }

  const factoryConditionSetSettings: InPlaceEditProps<any> = {
    id: "factoryConditionSetId",
    value: step.factoryConditionSetId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select factory condition set ...",
      ...fCAdapter,
    },
    renderPreview: step.factoryConditionSet
      ? (_) => (
          <FactoryConditionSetResourceLink
            data={step.factoryConditionSet}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      return update({
        factoryPipelineStep: {
          factoryConditionSetId: value[0].id,
        },
      });
    },
  };

  const factoryConditionSetInvertSettings: InPlaceEditProps = {
    id: "factoryConditionInvert",
    value: step.factoryConditionInvert,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return update({
        factoryPipelineStep: {
          factoryConditionSetInvert: value as boolean,
        },
      });
    },
  };

  const activeSettings: InPlaceEditProps = {
    id: "active",
    value: step.active,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: (value) => {
      return update({
        factoryPipelineStep: {
          active: value as boolean,
        },
      });
    },
  };

  const fillerFeaturerSettings: AutoEditDialogSettings = {
    value: {
      fillerFeaturerId: step.fillerFeaturerId,
    },
    title: "Update filler featurer",
    onSubmit: (values) => {
      console.log(values);
      return update({
        factoryPipelineStep: {
          fillerFeaturerId: values.fillerFeaturerId[0].id,
          fillerParams: values.fillerParams,
        },
      });
    },
    valuesInfo: {
      fillerFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Filler featurer",
        typeId: FeaturerTypes.filler,
        paramsFieldName: "fillerParams",
        ...fAdapter,
      },
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: step.description,
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
        factoryPipelineStep: {
          description: value as string,
        },
      });
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={step.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Factory</TableCell>
            <TableCell>
              {step.factoryPipeline?.factory && (
                <FactoryResourceLink
                  data={step.factoryPipeline?.factory}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Pipeline</TableCell>
            <TableCell>
              {step.factoryPipeline && (
                <FactoryPipelineResourceLink
                  data={step.factoryPipeline}
                  withTooltip
                />
              )}
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

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(fillerFeaturerSettings)}
          >
            <TableCell>Filler featurer</TableCell>
            <TableCell>
              {step.fillerFeaturer && (
                <FeaturerResourceLink
                  data={step.fillerFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              )}
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
