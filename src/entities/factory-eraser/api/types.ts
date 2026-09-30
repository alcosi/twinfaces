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

export type FactoryEraserUpdateRq =
  components["schemas"]["FactoryEraserUpdateRqV1"];
// The endpoint takes a batch; a single entity is what every screen actually
// sends, so the hook speaks this and wraps it into the list itself.
export type FactoryEraserUpdate =
  components["schemas"]["FactoryEraserUpdateV1"];

export type FactoryEraserExportSqlRq =
  components["schemas"]["FactoryEraserExportSqlRqV1"];

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
  Pick<
    components["schemas"]["FactoryEraserSearchDTOv1"],
    FactoryEraserFilterKeys
  >
>;
export type FactoryEraserDuplicateRq =
  components["schemas"]["FactoryEraserDuplicateRqV1"];

export type FactoryEraserSortField = NonNullable<
  components["schemas"]["FactoryEraserSearchRqV1"]["sortField"]
>;

export type FactoryEraserCountRq =
  components["schemas"]["FactoryEraserCountRqV1"];

export type FactoryEraserCountGroupField = NonNullable<
  FactoryEraserCountRq["groupFields"]
>[number];

export type FactoryEraserAction =
  components["schemas"]["FactoryEraserCountV1"]["action"];
