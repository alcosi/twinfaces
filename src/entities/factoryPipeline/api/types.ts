import { components } from "@/shared/api/generated/schema";

export type FactoryPipeline = components["schemas"]["FactoryPipelineV2"];
export type FactoryPipelineSearchRq =
  components["schemas"]["FactoryPipelineSearchRqV1"];

export type FactoryPipelineFilterKeys =
  | "idList"
  | "factoryIdList"
  | "inputTwinClassIdList"
  | "factoryConditionSetIdList"
  | "outputTwinStatusIdList"
  | "nextFactoryIdList"
  | "active"
  | "nextFactoryLimitScope";

export type FactoryPipelineFilters = Partial<
  Pick<FactoryPipelineSearchRq, FactoryPipelineFilterKeys>
>;
