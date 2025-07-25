import { ComboboxFormItem, FormItemProps } from "@/components/form-fields";

import { useValidTwinsForLinkSelectAdapter as useByTwinIdAdapter } from "@/entities/twin";
import { useValidTwinsForLinkSelectAdapter as useByTwinClassIdAdapter } from "@/entities/twin-class";
import { Twin } from "@/entities/twin/server";

import { TwinFieldFormItemProps } from "../twin-field-item";

type Props = FormItemProps &
  Pick<TwinFieldFormItemProps, "twinClassId" | "twinId"> & {
    linkId: string;
    multi: boolean;
    onChange?: (value: string) => void;
  };

export function TwinFieldSelectLinkLongFormItem({
  twinClassId,
  twinId,
  linkId,
  onChange,
  ...props
}: Props) {
  const adapter = twinId
    ? useByTwinIdAdapter({ twinId, linkId })
    : useByTwinClassIdAdapter({ twinClassId, linkId });

  const handleOnSelect = (twins: unknown) =>
    onChange?.((twins as Twin[])[0]?.id!);

  return (
    <ComboboxFormItem
      {...props}
      getById={adapter.getById}
      getItems={adapter.getItems}
      renderItem={adapter.renderItem}
      onSelect={handleOnSelect}
    />
  );
}
