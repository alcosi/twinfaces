import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TransitionTriggerCreateRq,
  TransitionTriggerFilters,
  TransitionTriggerUpdateRq,
} from "./types";

export function createTransitionTriggerApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TransitionTriggerFilters;
  }) {
    return settings.client.POST("/private/transition_trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTransitionTriggerMode: "DETAILED",
          showTransitionTrigger2TwinTriggerMode: "DETAILED",
          showTransitionTrigger2TransitionMode: "DETAILED",
          showTwinTrigger2FeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
      },
    });
  }

  function create({ body }: { body: TransitionTriggerCreateRq }) {
    return settings.client.POST("/private/transition_trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTransitionTriggerMode: "DETAILED",
          showTransitionTrigger2TwinTriggerMode: "DETAILED",
          showTransitionTrigger2TransitionMode: "DETAILED",
        },
      },
      body,
    });
  }

  function update({ body }: { body: TransitionTriggerUpdateRq }) {
    return settings.client.PUT("/private/transition_trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTransitionTriggerMode: "DETAILED",
          showTransitionTrigger2TwinTriggerMode: "DETAILED",
          showTransitionTrigger2TransitionMode: "DETAILED",
        },
      },
      body,
    });
  }

  return { search, create, update };
}

export type TransitionTriggerApi = ReturnType<
  typeof createTransitionTriggerApi
>;
