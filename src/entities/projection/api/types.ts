import { components } from "@/shared/api/generated/schema";

export type ProjectionSearchRq = components["schemas"]["ProjectionSearchV1"];

export type Projection = components["schemas"]["ProjectionV1"];

export type Projection_DETAILED = Required<Projection> & {
  projectionType?: ProjectionType;
};

export type ProjectionType = components["schemas"]["ProjectionTypeV1"];

export type ProjectionFilterKeys =
  | "idList"
  | "srcTwinPointerIdList"
  | "srcTwinClassFieldIdList"
  | "dstTwinClassIdList"
  | "dstTwinClassFieldIdList"
  | "fieldProjectorIdList";

export type ProjectionFilters = Partial<
  Pick<ProjectionSearchRq, ProjectionFilterKeys>
>;
