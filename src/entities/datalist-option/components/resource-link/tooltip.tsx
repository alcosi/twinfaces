import { DatalistResourceLink } from "@/entities/datalist";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Option } from "lucide-react";
import { DataListOptionV3 } from "@/entities/datalist-option";

type Props = {
  data: DataListOptionV3;
  link: string;
};

export function DatalistOptionResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={<Option size={35} />}
      />

      <ResourceLinkTooltip.Main>
        {data.dataList && (
          <ResourceLinkTooltip.Item title="Datalist">
            <DatalistResourceLink data={data.dataList} />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
