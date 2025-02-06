import { useTwinsFromLinkSelectAdapter } from "@/entities/twinLink";
import { ComboboxFormItem, FormItemProps } from "@/components/form-fields";
import React from "react";

export interface TwinForLinkSelectFormItemProps extends FormItemProps {
  twinClassId?: string;
  twinId?: string;
  linkId?: string;
  multiple: boolean;
}

export function TwinForLinkSelectFormItem({
  twinClassId,
  twinId,
  linkId,
  multiple,
  ...props
}: TwinForLinkSelectFormItemProps) {
  const twinsFromLinkAdapter = useTwinsFromLinkSelectAdapter({
    twinClassId,
    twinId,
    linkId,
  });

  return (
    <ComboboxFormItem
      {...twinsFromLinkAdapter}
      getById={twinsFromLinkAdapter.getById}
      getItems={(search) => twinsFromLinkAdapter.getItems(search)}
      renderItem={twinsFromLinkAdapter.renderItem}
      multi={multiple}
      {...props}
    />
  );
}