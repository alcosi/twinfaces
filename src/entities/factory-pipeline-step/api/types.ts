import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryPipeline } from "@/entities/factory-pipeline";
import { ExtendedFeaturerParam, Featurer } from "@/entities/featurer";
import { components, operations } from "@/shared/api/generated/schema";

export type PipelineStep = components["schemas"]["FactoryPipelineStepV1"];

export type PipelineStep_DETAILED = Required<PipelineStep> & {
  factoryPipeline?: FactoryPipeline;
  fillerFeaturer?: Featurer;
  factoryConditionSet?: FactoryConditionSet;
  fillerDetailedParams?: ExtendedFeaturerParam[];
};

export type PipelineStepSearchRq =
  components["schemas"]["FactoryPipelineStepSearchRqV1"];
export type PipelineStepCreateRq =
  components["schemas"]["FactoryPipelineStepCreateRqV1"];

export type FactoryPipelineStepUpdateRq =
  components["schemas"]["FactoryPipelineStepUpdateRqV1"];

export type PipelineStepFilterKeys =
  | "idList"
  | "factoryIdList"
  | "descriptionLikeList"
  | "optional"
  | "factoryPipelineIdList"
  | "conditionInvert"
  | "active"
  | "fillerFeaturerIdList"
  | "factoryConditionSetIdList";

export type PipelineStepFilters = Partial<
  Pick<PipelineStepSearchRq, PipelineStepFilterKeys>
>;

export type FactoryPipelineStepRqQuery =
  operations["factoryPipelineStepViewV1"]["parameters"]["query"];
