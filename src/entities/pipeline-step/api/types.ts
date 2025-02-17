import { components } from "@/shared/api/generated/schema";

export type PipelineStep = components["schemas"]["FactoryPipelineStepV2"];
export type PipelineStep_DETAILED = Required<PipelineStep>;

export type PipelineStepSearchRq =
  components["schemas"]["FactoryPipelineStepSearchRqV1"];

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
