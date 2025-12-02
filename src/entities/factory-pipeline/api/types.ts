import type { Factory } from "@/entities/factory";
import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinStatus } from "@/entities/twin-status";
import { components, operations } from "@/shared/api/generated/schema";

export type FactoryPipeline = components["schemas"]["FactoryPipelineV1"] & {
  factory?: Factory;
  nextFactory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  outputTwinStatus?: TwinStatus;
  factoryConditionSet?: FactoryConditionSet;
};
export type FactoryPipeline_DETAILED = Required<FactoryPipeline>;

export type FactoryPipelineSearchRq =
  components["schemas"]["FactoryPipelineSearchRqV1"];
export type FactoryPipelineViewQuery =
  operations["factoryPipelineViewV1"]["parameters"]["query"];
export type FactoryPipelineUpdateRq =
  components["schemas"]["FactoryPipelineUpdateRqV1"];
export type FactoryPipelineCreateRq =
  components["schemas"]["FactoryPipelineCreateRqV1"];

export type FactoryPipelineFilterKeys =
  | "idList"
  | "factoryIdList"
  | "inputTwinClassIdList"
  | "factoryConditionSetIdList"
  | "outputTwinStatusIdList"
  | "nextFactoryIdList"
  | "active"
  | "descriptionLikeList";

export type FactoryPipelineFilters = Partial<
  Pick<FactoryPipelineSearchRq, FactoryPipelineFilterKeys>
>;
