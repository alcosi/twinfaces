import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { ArrowRightLeft } from "lucide-react";
import { TF_Transition } from "../../api";

type Props = {
  data: TF_Transition;
  link: string;
};

export function TwinClassTransitionResourceTooltip({ data, link }: Props) {
  if (isUndefined(data.id)) return null;

  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.alias}
        iconSource={ArrowRightLeft}
      />
    </ResourceLinkTooltip>
  );
}
