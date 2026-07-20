import { Control } from "react-hook-form";
import z from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  ComboboxFormField,
  SwitchFormField,
  TextFormField,
} from "@/components/form-fields";

import {
  NOTIFICATION_SCHEMA,
  useNotificationSchemaSelectAdapter,
  useRecipientSelectAdapter,
} from "@/entities/notification";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import {
  useValidatorSetFilters,
  useValidatorSetSelectAdapterWithFilters,
} from "@/entities/validator-set";

export function NotificationFormFields({
  control,
}: {
  control: Control<z.infer<typeof NOTIFICATION_SCHEMA>>;
}) {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();
  const validatorSetAdapter = useValidatorSetSelectAdapterWithFilters();
  const recipientAdapter = useRecipientSelectAdapter();
  const notificationSchemaAdapter = useNotificationSchemaSelectAdapter();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});

  const {
    buildFilterFields: buildValidatorSetFilters,
    mapFiltersToPayload: mapValidatorSetFilters,
  } = useValidatorSetFilters();

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin class",
    adapter: twinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class...",
    multi: false,
  };

  const twinClassFieldInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin class field",
    adapter: twinClassFieldAdapter,
    extraFilters: buildTwinClassFieldFilters(),
    mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class field...",
    multi: false,
  };

  const twinValidatorSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Twin validator set",
    adapter: validatorSetAdapter,
    extraFilters: buildValidatorSetFilters(),
    mapExtraFilters: (filters) => mapValidatorSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin validator set...",
    multi: false,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={twinClassInfo}
        required
      />
      <ComplexComboboxFormField
        control={control}
        name="twinClassFieldId"
        info={twinClassFieldInfo}
      />
      // TODO Replace by [input field] history type
      https://alcosi.atlassian.net/browse/TWINFACES-784
      <TextFormField
        control={control}
        name="historyTypeId"
        label="History type"
        required
      />
      <ComboboxFormField
        control={control}
        name="notificationSchemaId"
        label="Notification schema"
        selectPlaceholder="Select notification schema..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        required
        {...notificationSchemaAdapter}
      />
      <ComboboxFormField
        control={control}
        name="historyNotificationRecipientId"
        label="History notification recipient"
        selectPlaceholder="Select recipient..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        required
        {...recipientAdapter}
      />
      // TODO Replace by [input filed] notification channel event
      https://alcosi.atlassian.net/browse/TWINFACES-788
      <TextFormField
        control={control}
        name="notificationChannelEventId"
        label="Notification channel event"
        required
      />
      <ComplexComboboxFormField
        control={control}
        name="twinValidatorSetId"
        info={twinValidatorSetInfo}
      />
      <SwitchFormField
        control={control}
        name="twinValidatorSetInvert"
        label="Twin validator set invert"
      />
    </>
  );
}
