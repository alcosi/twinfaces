import type { Factory } from "@/entities/factory";
import type { TwinFlow_DETAILED } from "@/entities/twin-flow";
import { components } from "@/shared/api/generated/schema";

export type TwinFlowFactory = components["schemas"]["TwinflowFactoryV1"];

export type TwinFlowFactory_DETAILED = Required<TwinFlowFactory> & {
  twinflow?: TwinFlow_DETAILED;
  factory?: Factory;
};

export type TwinFlowFactorySearchRq =
  components["schemas"]["TwinflowFactorySearchRqV1"];

export type TwinFlowFactoryFilterKeys =
  | "idSet"
  | "twinflowIdSet"
  | "factoryIdSet"
  | "factoryLauncherSet";

export type TwinFlowFactoryFilters = Partial<
  Pick<
    components["schemas"]["TwinflowFactorySearchV1"],
    TwinFlowFactoryFilterKeys
  >
>;

export type TwinFlowFactoryCreateRq =
  components["schemas"]["TwinflowFactoryCreateRqV1"];
export type TwinFlowFactoryCreateV1 =
  components["schemas"]["TwinflowFactoryCreateV1"];
export type TwinFlowFactoryUpdateRq =
  components["schemas"]["TwinflowFactoryUpdateRqV1"];
export type TwinFlowFactoryUpdateV1 =
  components["schemas"]["TwinflowFactoryUpdateV1"];
