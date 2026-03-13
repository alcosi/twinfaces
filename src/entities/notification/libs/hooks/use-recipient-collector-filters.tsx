import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  RecipientCollectorsFilterKeys,
  RecipientCollectorsFilters,
  useRecipientSelectAdapter,
} from "@/entities/notification";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
} from "@/shared/libs";

export function useRecipientCollectorFilters({
  enabledFilters,
}: {
  enabledFilters?: RecipientCollectorsFilterKeys[];
}): FilterFeature<RecipientCollectorsFilterKeys, RecipientCollectorsFilters> {
  const recipientSelectAdapter = useRecipientSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(47);

  const allFilters: Record<RecipientCollectorsFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    recipientIdList: {
      type: AutoFormValueType.combobox,
      label: "Notification recipient",
      multi: true,
      ...recipientSelectAdapter,
    },
    recipientResolverFeaturerIdList: {
      type: AutoFormValueType.combobox,
      label: "Recipient resolver featurer",
      multi: true,
      ...featurerAdapter,
    },
    exclude: {
      type: AutoFormValueType.boolean,
      label: "Exclude",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    RecipientCollectorsFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<RecipientCollectorsFilterKeys, unknown>
  ): RecipientCollectorsFilters {
    return {
      idList: toArrayOfString(filters.idList),
      recipientIdList: toArrayOfString(filters.recipientIdList, "id"),
      recipientResolverFeaturerIdList: toArrayOfString(
        filters.recipientResolverFeaturerIdList,
        "id"
      ).map(Number),
      exclude: mapToChoice(filters.exclude),
    };
  }
  return { buildFilterFields, mapFiltersToPayload };
}
