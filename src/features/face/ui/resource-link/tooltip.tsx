import { FaceNB001 } from "@/entities/face";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { FaceNavBarIcon } from "../face-nav-bar-icon";

type Props = {
  data: FaceNB001;
  link: string;
};

export function FaceNavBarResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={<FaceNavBarIcon className="h-9 w-9" />}
      />

      <ResourceLinkTooltip.Main>
        {data.description && (
          <ResourceLinkTooltip.Item title="description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
