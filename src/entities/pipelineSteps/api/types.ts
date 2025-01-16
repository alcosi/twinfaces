import { components } from "@/shared/api/generated/schema";
import { FactoryPipeline } from "../../factoryPipeline";

export type PipelineSteps = components["schemas"]["FactoryPipelineStepV2"];
export type PipelineSteps_DETAILED = Required<PipelineSteps>;

// export type PipelineSteps_DETAILED = PipelineSteps & {factoryPipeline?: FactoryPipeline}

export type PipelineStepsSearchRq =
  components["schemas"]["FactoryPipelineStepSearchRqV1"];

export type PipelineStepsFilterKeys =
  | "idList"
  | "idExcludeList"
  | "factoryIdList"
  | "factoryIdExcludeList"
  | "factoryPipelineIdList"
  | "factoryPipelineIdExcludeList"
  | "factoryConditionSetIdList"
  | "factoryConditionSetIdExcludeList"
  | "descriptionLikeList"
  | "descriptionNotLikeList"
  | "fillerFeaturerIdList"
  | "fillerFeaturerIdExcludeList"
  | "optional";

export type PipelineStepsFilters = Partial<
  Pick<PipelineStepsSearchRq, PipelineStepsFilterKeys>
>;
