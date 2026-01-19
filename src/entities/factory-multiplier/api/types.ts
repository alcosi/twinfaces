import { Factory } from "@/entities/factory";
import { ExtendedFeaturerParam, Featurer } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components, operations } from "@/shared/api/generated/schema";

export type FactoryMultiplier = components["schemas"]["FactoryMultiplierV1"];

export type FactoryMultiplier_DETAILED = Required<FactoryMultiplier> & {
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  multiplierFeaturer?: Featurer;
  multiplierDetailedParams?: ExtendedFeaturerParam[];
};

export type FactoryMultiplierSearchRq =
  components["schemas"]["FactoryMultiplierSearchRqV1"];
export type FactoryMultiplierViewQuery =
  operations["factoryMultiplierViewV1"]["parameters"]["query"];
export type FactoryMultiplierUpdateRq =
  components["schemas"]["FactoryMultiplierUpdateRqV1"];
export type FactoryMultiplierCreateRq =
  components["schemas"]["FactoryMultiplierCreateRqV1"];

export type FactoryMultiplierFilterKeys =
  | "idList"
  | "factoryIdList"
  | "inputTwinClassIdList"
  | "multiplierFeaturerIdList"
  | "active"
  | "descriptionLikeList";

export type FactoryMultiplierFilters = Partial<
  Pick<FactoryMultiplierSearchRq, FactoryMultiplierFilterKeys>
>;
