import z from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useRecipientSelectAdapter } from "@/entities/notification";
import {
  TwinClass_DETAILED,
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import { useValidatorSetSelectAdapter } from "@/entities/validator-set";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  reduceToObject,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import {
  HistoryNotificationFilterKeys,
  HistoryNotificationFilters,
} from "../../api";

export function useHistoryNotificationFilters({
  enabledFilters,
}: {
  enabledFilters?: HistoryNotificationFilterKeys[];
}): FilterFeature<HistoryNotificationFilterKeys, HistoryNotificationFilters> {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const twinClassFieldsAdapter = useTwinClassFieldSelectAdapterWithFilters();
  const recipientAdapter = useRecipientSelectAdapter();
  const validatorSetAdapter = useValidatorSetSelectAdapter();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});

  const allFilters: Record<HistoryNotificationFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinClassIdMap: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    twinClassFieldIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin class field",
      adapter: twinClassFieldsAdapter,
      extraFilters: buildTwinClassFieldFilters(),
      mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    // TODO Replace by https://alcosi.atlassian.net/browse/TWINFACES-785
    historyTypeIdList: {
      type: AutoFormValueType.tag,
      label: "History type",
      schema: z.string(),
      placeholder: "Enter UUID",
    },
    // TODO Replace by https://alcosi.atlassian.net/browse/TWINFACES-787
    notificationSchemaIdList: {
      type: AutoFormValueType.tag,
      label: "Notification schema",
      schema: z.string(),
      placeholder: "Enter UUID",
    },
    historyNotificationRecipientIdList: {
      type: AutoFormValueType.combobox,
      label: "History notification recipient",
      multi: true,
      ...recipientAdapter,
    },
    // TODO Replace by https://alcosi.atlassian.net/browse/TWINFACES-789
    notificationChannelEventIdList: {
      type: AutoFormValueType.tag,
      label: "Notification channel event",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinValidatorSetIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin validator set",
      multi: true,
      ...validatorSetAdapter,
    },
    twinValidatorSetInvert: {
      type: AutoFormValueType.boolean,
      label: "Twin validator set invert",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    HistoryNotificationFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<HistoryNotificationFilterKeys, unknown>
  ): HistoryNotificationFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinClassIdMap: reduceToObject({
        list: toArray(filters.twinClassIdMap) as TwinClass_DETAILED[],
        defaultValue: true,
      }),
      twinClassFieldIdList: toArrayOfString(filters.twinClassFieldIdList, "id"),
      historyTypeIdList: toArrayOfString(filters.historyTypeIdList),
      notificationSchemaIdList: toArrayOfString(
        filters.notificationSchemaIdList
      ),
      historyNotificationRecipientIdList: toArrayOfString(
        filters.historyNotificationRecipientIdList,
        "id"
      ),
      notificationChannelEventIdList: toArrayOfString(
        filters.notificationChannelEventIdList
      ),
      twinValidatorSetIdList: toArrayOfString(
        filters.twinValidatorSetIdList,
        "id"
      ),
      twinValidatorSetInvert: mapToChoice(filters.twinValidatorSetInvert),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
