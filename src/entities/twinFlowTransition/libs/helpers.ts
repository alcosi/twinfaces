import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { RelatedObjects } from "@/shared/api";
import { toArray, toArrayOfString, wrapWithPercent } from "@/shared/libs";
import {
  TF_Transition,
  TF_Transition_DETAILED,
  TwinFlowTransitionApiFilterFields,
  TwinFlowTransitionApiFilters,
} from "../api";

export function mapToTwinFlowTransitionApiFilters(
  filters: Record<TwinFlowTransitionApiFilterFields, unknown>
): TwinFlowTransitionApiFilters {
  const result: TwinFlowTransitionApiFilters = {
    aliasLikeList: toArrayOfString(toArray(filters.aliasLikeList), "alias").map(
      wrapWithPercent
    ),
    srcStatusIdList: toArrayOfString(
      toArray(filters.srcStatusIdList),
      "srcTwinStatusId"
    ),
    dstStatusIdList: toArrayOfString(
      toArray(filters.dstStatusIdList),
      "dstTwinStatusId"
    ),
    permissionIdList: toArrayOfString(
      toArray(filters.permissionIdList),
      "permissionId"
    ),
  };

  return result;
}

export function buildFilterFields(
  transitions: TF_Transition_DETAILED[]
): Record<
  Exclude<TwinFlowTransitionApiFilterFields, "twinflowIdList">,
  AutoFormValueInfo | any
> {
  return {
    aliasLikeList: {
      type: AutoFormValueType.combobox,
      label: "Alias",
      multi: true,
      getById: async (key: string) =>
        transitions?.find((i: TF_Transition) => i.alias === key),
      getItems: async (needle: string) => {
        return transitions?.filter((i) =>
          i.name?.toLowerCase().includes(needle.toLowerCase())
        );
      },
      getItemKey: (i: TF_Transition) => i.alias,
      getItemLabel: (i: TF_Transition) => i.alias,
    },
    srcStatusIdList: {
      type: AutoFormValueType.string,
      label: "From",

      // TODO: Uncomment and refactor
      // as per https://alcosi.atlassian.net/browse/TWINFACES-117
      //   type: AutoFormValueType.multiCombobox,
      //   label: "From",
      //   multi: true,
      //   getById: async (key: string) =>
      //     transitions?.find((i: TF_Transition) => i.srcTwinStatusId === key),
      //   getItems: async (needle: string) => {
      //     return transitions?.filter((i) =>
      //       i.srcTwinStatus?.name?.toLowerCase().includes(needle.toLowerCase())
      //     );
      //   },
      //   getItemKey: (i: TF_Transition) => i.srcTwinStatusId,
      //   getItemLabel: (i: TF_Transition) => i.srcTwinStatus?.name,
    },

    dstStatusIdList: {
      type: AutoFormValueType.string,
      label: "To",

      // TODO: Uncomment and refactor
      // as per https://alcosi.atlassian.net/browse/TWINFACES-117
      //   type: AutoFormValueType.multiCombobox,
      //   label: "To",
      //   multi: true,
      //   getById: async (key: string) =>
      //     transitions?.find((i: TF_Transition) => i.dstTwinStatusId === key),
      //   getItems: async (needle: string) => {
      //     return transitions?.filter((i) =>
      //       i.dstTwinStatus?.name?.toLowerCase().includes(needle.toLowerCase())
      //     );
      //   },
      //   getItemKey: (i: TF_Transition) => i.dstTwinStatusId,
      //   getItemLabel: (i: TF_Transition) => i.dstTwinStatus?.name,
    },

    permissionIdList: {
      type: AutoFormValueType.string,
      label: "Permission",

      // TODO: Uncomment and refactor
      // as per https://alcosi.atlassian.net/browse/TWINFACES-116
      //   type: AutoFormValueType.multiCombobox,
      //   label: "Permission",
      //   multi: true,
      //   getById: async (key: string) =>
      //     transitions?.find((i: TF_Transition) => i.permissionId === key),
      //   getItems: async (needle: string) => {
      //     return transitions?.filter((i) =>
      //       i.permission?.name?.toLowerCase().includes(needle.toLowerCase())
      //     );
      //   },
      //   getItemKey: (i: TF_Transition) => i.permissionId,
      //   getItemLabel: (i: TF_Transition) => i.permission?.key,
    },
  };
}

export const hydrateTwinFlowTransitionFromMap = (
  transitionDTO: TF_Transition,
  relatedObjects?: RelatedObjects
): TF_Transition_DETAILED => {
  const transition: TF_Transition_DETAILED = Object.assign(
    {},
    transitionDTO
  ) as TF_Transition_DETAILED;
  if (transitionDTO.srcTwinStatusId && relatedObjects?.statusMap) {
    transition.srcTwinStatus =
      relatedObjects.statusMap[transitionDTO.srcTwinStatusId];
  }

  if (transitionDTO.dstTwinStatusId && relatedObjects?.statusMap) {
    transition.dstTwinStatus =
      relatedObjects.statusMap[transitionDTO.dstTwinStatusId];
  }

  if (transitionDTO.permissionId && relatedObjects?.permissionMap) {
    transition.permission =
      relatedObjects.permissionMap[transitionDTO.permissionId];
  }

  if (transitionDTO.createdByUserId && relatedObjects?.userMap) {
    transition.createdByUser =
      relatedObjects.userMap[transitionDTO.createdByUserId];
  }

  return transition;
};
