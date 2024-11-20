import { DataListV1 } from "@/entities/twinClass";
import { ResourceLinkTooltip } from "@/shared/ui";
import { isPopulatedString } from "@/shared/libs";
import { ListTree } from "lucide-react";

type PropsDataTooltip = {
  data: DataListV1;
  link: string;
};

export const DatalistResourceTooltip = ({ data, link }: PropsDataTooltip) => {
  return (
    <ResourceLinkTooltip uuid={data.id || "N/A"} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={data.id ? <ListTree size={35} /> : "N/A"}
      />

      <ResourceLinkTooltip.Main>
        {data.updatedAt && (
          <ResourceLinkTooltip.Item title="Updated at">
            {new Date(data.updatedAt).toLocaleDateString()}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
