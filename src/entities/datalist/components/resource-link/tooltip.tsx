import { DataList } from "@/entities/datalist";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { ListTree } from "lucide-react";

type Props = {
  data: DataList;
  link: string;
};

export function DatalistResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={<ListTree size={35} />}
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
}
