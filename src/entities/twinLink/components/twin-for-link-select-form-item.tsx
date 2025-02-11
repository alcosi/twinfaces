import { ComboboxFormItem, FormItemProps } from "@/components/form-fields";
import { useTwinsForLinkSelectAdapter } from "@/entities/twinLink";

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
  const twinsForLinkAdapter = useTwinsForLinkSelectAdapter({
    twinClassId,
    twinId,
    linkId,
  });

  return (
    <ComboboxFormItem
      {...twinsForLinkAdapter}
      getById={twinsForLinkAdapter.getById}
      getItems={(search) => twinsForLinkAdapter.getItems(search)}
      renderItem={twinsForLinkAdapter.renderItem}
      multi={multiple}
      {...props}
    />
  );
}
