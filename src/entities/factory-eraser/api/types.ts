import { Factory } from "@/entities/factory";
import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components, operations } from "@/shared/api/generated/schema";

export type FactoryEraser = components["schemas"]["FactoryEraserV1"] & {
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  factoryConditionSet?: FactoryConditionSet;
};
export type FactoryEraser_DETAILED = Required<FactoryEraser>;

export type FactoryEraserSearchRq =
  components["schemas"]["FactoryEraserSearchRqV1"];

export type FactoryEraserRqQuery =
  operations["factoryEraserViewV1"]["parameters"]["query"];

export type FactoryEraserUpdate =
  components["schemas"]["FactoryEraserUpdateRqV1"];

export type FactoryEraserFilterKeys =
  | "idList"
  | "factoryIdList"
  | "inputTwinClassIdList"
  | "factoryConditionSetIdList"
  | "conditionInvert"
  | "active"
  | "eraseActionLikeList"
  | "descriptionLikeList";

export type FactoryEraserFilters = Partial<
  Pick<FactoryEraserSearchRq, FactoryEraserFilterKeys>
>;
