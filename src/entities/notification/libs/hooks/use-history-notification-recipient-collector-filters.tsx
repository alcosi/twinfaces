import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  HistoryNotificationRecipientCollectorsFilterKeys,
  HistoryNotificationRecipientCollectorsFilters,
  useHistoryNotificztionRecipientSelectAdapter,
} from "@/entities/notification";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
} from "@/shared/libs";

export function useHistoryNotificationRecipientCollectorFilters({
  enabledFilters,
}: {
  enabledFilters?: HistoryNotificationRecipientCollectorsFilterKeys[];
}): FilterFeature<
  HistoryNotificationRecipientCollectorsFilterKeys,
  HistoryNotificationRecipientCollectorsFilters
> {
  const recipientSelectAdapter = useHistoryNotificztionRecipientSelectAdapter();
  const recipientResolverSelectAdapter = useFeaturerSelectAdapter(47);

  const allFilters: Record<
    HistoryNotificationRecipientCollectorsFilterKeys,
    AutoFormValueInfo
  > = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    recipientIdList: {
      type: AutoFormValueType.combobox,
      label: "Recipient",
      multi: true,
      ...recipientSelectAdapter,
    },
    recipientResolverFeaturerIdList: {
      type: AutoFormValueType.combobox,
      label: "Recipient resolver featurer",
      multi: true,
      ...recipientResolverSelectAdapter,
    },
    exclude: {
      type: AutoFormValueType.boolean,
      label: "Exclude",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    HistoryNotificationRecipientCollectorsFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<HistoryNotificationRecipientCollectorsFilterKeys, unknown>
  ): HistoryNotificationRecipientCollectorsFilters {
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
