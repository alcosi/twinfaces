"use client";

import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";
import { useContext } from "react";
import { FactoryResourceLink } from "@/entities/factory";
import { PipelineStepContext } from "@/features/pipeline-step";
import { FactoryPipelineResourceLink } from "@/entities/factory-pipeline";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import { Featurer_DETAILED, FeaturerResourceLink } from "@/entities/featurer";

export function FactoryPipelineStepGeneral() {
  const { step } = useContext(PipelineStepContext);

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
              {step.factoryConditionSet && (
                <FactoryConditionSetResourceLink
                  data={step.factoryConditionSet}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Condition invert</TableCell>
            <TableCell>{step.factoryConditionInvert ? "Yes" : "No"}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>{step.active ? "Yes" : "No"}</TableCell>
          </TableRow>

          <TableRow>
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
            <TableCell>{step.description}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
