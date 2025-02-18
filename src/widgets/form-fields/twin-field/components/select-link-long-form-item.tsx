import { ComboboxFormItem, FormItemProps } from "@/components/form-fields";
import { useValidTwinsForLinkSelectAdapter as useByTwinIdAdapter } from "@/entities/twin";
import { useValidTwinsForLinkSelectAdapter as useByTwinClassIdAdapter } from "@/entities/twin-class";
import { TwinFieldFormItemProps } from "../twin-field-item";

export type Props = FormItemProps &
  Pick<TwinFieldFormItemProps, "twinClassId" | "twinId"> & {
    linkId: string;
    multi: boolean;
  };

export function TwinFieldSelectLinkLongFormItem({
  twinClassId,
  twinId,
  linkId,
  ...props
}: Props) {
  const byTwinIdAdapter = useByTwinIdAdapter({
    twinId,
    linkId,
  });
  const byTwinClassIdAdapter = useByTwinClassIdAdapter({
    twinClassId,
    linkId,
  });
  const adapter = twinId ? byTwinIdAdapter : byTwinClassIdAdapter;

  return <ComboboxFormItem {...adapter} {...props} />;
}
