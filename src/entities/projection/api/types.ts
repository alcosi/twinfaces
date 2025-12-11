import { Featurer } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { components } from "@/shared/api/generated/schema";

export type ProjectionSearchRq = components["schemas"]["ProjectionSearchV1"];

export type Projection = components["schemas"]["ProjectionV1"];

export type Projection_DETAILED = Required<Projection> & {
  projectionType?: ProjectionType;
  srcTwinClassField?: TwinClassField_DETAILED;
  dstTwinClass?: TwinClass_DETAILED;
  dstTwinClassField?: TwinClassField_DETAILED;
  fieldProjectorFeaturer?: Featurer;
};

export type ProjectionFilterKeys =
  | "idList"
  | "dstTwinClassIdList"
  | "fieldProjectorIdList"
  | "srcTwinClassFieldIdList"
  | "dstTwinClassFieldIdList";

export type ProjectionFilters = Partial<
  Pick<ProjectionSearchRq, ProjectionFilterKeys>
>;

export type ProjectionType = components["schemas"]["ProjectionTypeV1"];

export type ProjectionTypeSearchRq =
  components["schemas"]["ProjectionTypeSearchV1"];

export type ProjectionTypeFiltersKeys = "nameLikeList";

export type ProjectionTypeFilters = Partial<
  Pick<ProjectionTypeSearchRq, ProjectionTypeFiltersKeys>
>;
