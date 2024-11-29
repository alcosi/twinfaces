import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { components, operations } from "@/shared/api/generated/schema";
import { PaginationState } from "@tanstack/table-core";
import { TwinClassCreateRq, TwinClassUpdateRq } from "./types";

type TwinClassApiFilters = Partial<
  Pick<
    components["schemas"]["TwinClassListRqV1"],
    | "twinClassIdList"
    | "twinClassKeyLikeList"
    | "nameI18nLikeList"
    | "descriptionI18nLikeList"
    | "headTwinClassIdList"
    | "extendsTwinClassIdList"
    | "ownerTypeList"
    | "twinflowSchemaSpace"
    | "twinClassSchemaSpace"
    | "permissionSchemaSpace"
    | "aliasSpace"
    | "abstractt"
  >
>;

export function createTwinClassApi(settings: ApiSettings) {
  function search({
    pagination,
    search,
    filters,
  }: {
    pagination: PaginationState;
    search?: string;
    filters: TwinClassApiFilters;
  }) {
    return settings.client.POST("/private/twin_class/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassMode: "MANAGED",
          showTwinClassHead2TwinClassMode: "DETAILED",
          showTwinClassExtends2TwinClassMode: "DETAILED",
          showTwinClassMarker2DataListOptionMode: "DETAILED",
          showTwinClassTag2DataListOptionMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
        twinClassKeyLikeList: search
          ? ["%" + search + "%"]
          : filters.twinClassKeyLikeList,
      },
    });
  }

  function getByKey({
    key,
    query = {},
  }: {
    key: string;
    query: operations["twinClassViewByKeyV1"]["parameters"]["query"];
  }) {
    return settings.client.GET(`/private/twin_class_by_key/{twinClassKey}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassKey: key },
        query: query,
      },
    });
  }

  function getById({
    id,
    query = {},
  }: {
    id: string;
    query: operations["twinClassViewV1"]["parameters"]["query"];
  }) {
    return settings.client.GET(`/private/twin_class/{twinClassId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId: id },
        query: query,
      },
    });
  }

  function create({ body }: { body: TwinClassCreateRq }) {
    return settings.client.POST("/private/twin_class/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ id, body }: { id: string; body: TwinClassUpdateRq }) {
    return settings.client.PUT("/private/twin_class/{twinClassId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId: id },
      },
      body: body,
    });
  }
  return {
    search,
    getByKey,
    getById,
    create,
    update,
  };
}

export type TwinClassApi = ReturnType<typeof createTwinClassApi>;
