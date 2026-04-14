import { Factory } from "@/entities/factory";
import { FactoryConditionSet } from "@/entities/factory-condition-set";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinTrigger } from "@/entities/twin-trigger";
import { components } from "@/shared/api/generated/schema";

export type FactoryTrigger = components["schemas"]["TwinFactoryTriggerV1"];

export type FactoryTrigger_DETAILED = Required<FactoryTrigger> & {
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  factoryConditionSet?: FactoryConditionSet;
  twinTrigger?: TwinTrigger;
};

export type FactoryTriggerSearchRq =
  components["schemas"]["TwinFactoryTriggerSearchV1"];

export type FactoryTriggerFilterKeys =
  | "idList"
  | "twinFactoryIdList"
  | "inputTwinClassIdList"
  | "twinTriggerIdList"
  | "active"
  | "async";

export type FactoryTriggerFilters = Partial<
  Pick<FactoryTriggerSearchRq, FactoryTriggerFilterKeys>
>;
